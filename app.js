// =====================================================
// 1. DATA
// Two lists: products, and movements (every IN / OUT / correction).
// They are saved in this browser (localStorage), so they stay after closing.
// =====================================================

let products = loadList("products");
let movements = loadList("movements");

// Mock accounts. This is only a door for the demo, NOT real security:
// anyone can read these passwords in this file. Do not reuse a real password here.
// access "full" sees everything, "limited" only sees Home totals, Stock and Record.
const USERS = [
  { username: "owner", password: "owner123", name: "Owner", access: "full" },
  { username: "mom", password: "mom123", name: "Mom", access: "full" },
  { username: "dad", password: "dad123", name: "Dad", access: "full" },
  { username: "staff", password: "staff123", name: "Staff", access: "limited" }
];
const FULL_ONLY_PAGES = ["history", "insights", "settings"];
const RANGE_TITLES = { day: "Today, hour by hour", week: "Last 7 days", month: "Last 30 days", year: "Last 12 months" };

let currentUser = null;     // the account that is logged in
let recordType = "IN";      // which button is selected on the Record page
let cart = [{ productId: null, qty: "" }]; // the product lines on the Record page
let currentRange = "week";  // which button is selected on the Insights page
let historyRange = "week";  // which buttons are selected on the History page
let historyType = "ALL";
let historyLimit = 100;     // how many log rows to show
let editingId = null;       // null = adding a product, otherwise the id being edited

function loadList(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch (e) { return []; }
}

function saveData() {
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("movements", JSON.stringify(movements));
}

// ---------- small helpers ----------

function pad(n) { return String(n).padStart(2, "0"); }

// Date as text: "2026-10-30"
function dateStr(d) {
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}
function todayString() { return dateStr(new Date()); }
function nowTime() { const d = new Date(); return pad(d.getHours()) + ":" + pad(d.getMinutes()); }

// How much a movement changed the stock (+ or -).
// Works for old records from Phase 1 too (they have no "delta").
function deltaOf(m) {
  if (typeof m.delta === "number") return m.delta;
  return m.type === "IN" ? m.qty : -m.qty;
}

// Shortcut to create a page element
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function findProduct(id) { return products.find(p => p.id === id); }

// Write one row into the history
function addMovement(product, type, delta, note) {
  movements.push({
    date: todayString(),
    time: nowTime(),
    productId: product.id,
    productName: product.name,
    type: type,                 // "IN", "OUT" or "ADJUST" (a correction)
    qty: Math.abs(delta),
    delta: delta,
    note: note || "",
    stockAfter: product.stock   // remaining stock right after this movement
  });
}

function toast(message) {
  const t = document.getElementById("toast");
  t.textContent = message;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
}

// =====================================================
// 2. LOGIN AND PAGES
// =====================================================

function isFull() { return currentUser !== null && currentUser.access === "full"; }

function startSession(user) {
  currentUser = user;
  sessionStorage.setItem("user", user.username);
  document.body.classList.remove("logged-out");
  document.body.classList.toggle("limited", !isFull());
  document.getElementById("user-name").textContent = user.name + (isFull() ? "" : " (limited)");
  showPage("home");
}

document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("login-user").value.trim().toLowerCase();
  const password = document.getElementById("login-pass").value;
  const user = USERS.find(u => u.username === username && u.password === password);

  document.getElementById("login-pass").value = "";
  document.getElementById("login-error").textContent = user ? "" : "Wrong username or password.";
  if (user) startSession(user);
});

document.getElementById("logout-btn").addEventListener("click", function () {
  currentUser = null;
  sessionStorage.removeItem("user");
  document.body.classList.add("logged-out");
  document.getElementById("login-user").value = "";
});

function showPage(name) {
  if (!isFull() && FULL_ONLY_PAGES.includes(name)) name = "home";
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.id === "page-" + name));
  document.querySelectorAll("nav button").forEach(b => b.classList.toggle("active", b.dataset.page === name));
  window.scrollTo(0, 0);
  render();
}

function render() {
  renderDropdowns();
  renderHome();
  renderStock();
  renderRecord();
  if (isFull()) {
    renderInsights();
    renderHistory();
  }
}

// =====================================================
// 3. HOME
// =====================================================

function renderHome() {
  document.getElementById("today-date").textContent = new Date().toDateString();

  const low = products.filter(p => p.stock > 0 && p.stock < p.min).length;
  const out = products.filter(p => p.stock <= 0).length;
  document.getElementById("stat-total").textContent = products.length;
  document.getElementById("stat-low").textContent = low;
  document.getElementById("stat-out").textContent = out;

  // Today's totals
  const today = todayString();
  let totalIn = 0, totalOut = 0;
  for (const m of movements) {
    if (m.date !== today) continue;
    if (m.type === "IN") totalIn += m.qty;
    if (m.type === "OUT") totalOut += m.qty;
  }
  document.getElementById("total-in").textContent = totalIn;
  document.getElementById("total-out").textContent = totalOut;

  // Small chart of the last 7 days
  if (isFull()) drawChart(document.getElementById("home-chart"), summarize("week", null).buckets);

  // Products that need attention
  const list = document.getElementById("attention-list");
  list.innerHTML = "";
  const needs = products.filter(p => p.stock < p.min);
  if (needs.length === 0) {
    list.appendChild(el("li", "empty", products.length ? "All products have enough stock." : "No products yet. Go to Stock and add one."));
  }
  for (const p of needs) {
    const li = el("li");
    li.appendChild(el("div", "", p.name));
    const right = el("div", "qty " + (p.stock <= 0 ? "minus" : "low"));
    right.textContent = (p.stock <= 0 ? "Out of stock" : "Low: " + p.stock + " " + p.unit);
    li.appendChild(right);
    list.appendChild(li);
  }

  // Recent activity
  const recent = document.getElementById("recent-list");
  recent.innerHTML = "";
  if (!isFull()) return;
  if (movements.length === 0) recent.appendChild(el("li", "empty", "Nothing recorded yet."));
  for (const m of movements.slice(-8).reverse()) recent.appendChild(makeMoveRow(m));
}

// One line in the recent activity list
function makeMoveRow(m) {
  const li = el("li");
  const left = el("div");
  left.appendChild(el("div", "", m.productName));
  const info = [m.date, m.time, m.note].filter(Boolean).join(" · ");
  left.appendChild(el("div", "small", info));

  const d = deltaOf(m);
  const right = el("div", m.type === "ADJUST" ? "adj" : (d >= 0 ? "plus" : "minus"));
  right.textContent = (d > 0 ? "+" : "") + d;

  li.appendChild(left);
  li.appendChild(right);
  return li;
}

// =====================================================
// 4. STOCK PAGE (list, add, edit, delete)
// =====================================================

function renderStock() {
  const list = document.getElementById("stock-list");
  list.innerHTML = "";
  const search = document.getElementById("stock-search").value.trim().toLowerCase();
  const shown = products.filter(p => p.name.toLowerCase().includes(search));

  if (shown.length === 0) {
    list.appendChild(el("li", "empty", products.length ? "No product matches your search." : "No products yet. Tap + Add product."));
    return;
  }

  for (const p of shown) {
    const li = el("li", isFull() ? "clickable" : "");

    const left = el("div");
    left.appendChild(el("div", "", p.name));
    left.appendChild(el("div", "small", (p.kind === "material" ? "Material" : "Finished product") + " · warn below " + p.min));

    const right = el("div", "right");
    right.appendChild(el("div", "qty", p.stock + " " + p.unit));
    if (p.stock <= 0) right.appendChild(el("div", "small minus", "Out of stock"));
    else if (p.stock < p.min) right.appendChild(el("div", "small low", "Low stock"));
    else right.appendChild(el("div", "small ok", "OK"));

    li.appendChild(left);
    li.appendChild(right);
    if (isFull()) li.addEventListener("click", () => openProductDialog(p.id));
    list.appendChild(li);
  }
}

function openProductDialog(id) {
  editingId = id;
  const p = id === null ? null : findProduct(id);

  document.getElementById("dialog-title").textContent = p ? "Edit product" : "Add product";
  document.getElementById("p-name").value = p ? p.name : "";
  document.getElementById("p-kind").value = p ? p.kind : "material";
  document.getElementById("p-unit").value = p ? p.unit : "pcs";
  document.getElementById("p-stock").value = p ? p.stock : 0;
  document.getElementById("p-min").value = p ? p.min : 5;
  document.getElementById("p-stock-label").textContent = p
    ? "Stock now (change it only to fix a mistake)"
    : "Starting stock";
  document.getElementById("p-delete").style.display = p ? "block" : "none";

  document.getElementById("product-dialog").showModal();
}

document.getElementById("add-product-btn").addEventListener("click", () => openProductDialog(null));
document.getElementById("stock-search").addEventListener("input", renderStock);
document.getElementById("p-cancel").addEventListener("click", () => document.getElementById("product-dialog").close());

// Save (add or edit)
document.getElementById("product-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("p-name").value.trim();
  const kind = document.getElementById("p-kind").value;
  const unit = document.getElementById("p-unit").value.trim();
  const stock = Number(document.getElementById("p-stock").value);
  const min = Number(document.getElementById("p-min").value);

  if (editingId === null) {
    products.push({ id: Date.now(), name, kind, unit, stock, min });
  } else {
    const p = findProduct(editingId);
    p.name = name; p.kind = kind; p.unit = unit; p.min = min;
    if (stock !== p.stock) {
      // A correction is saved in the history, but it is NOT counted as IN or OUT
      const delta = stock - p.stock;
      p.stock = stock;
      addMovement(p, "ADJUST", delta, "Manual correction");
    }
  }

  saveData();
  document.getElementById("product-dialog").close();
  render();
  toast("Saved");
});

// Delete
document.getElementById("p-delete").addEventListener("click", function () {
  const p = findProduct(editingId);
  if (!p) return;
  if (!confirm('Delete "' + p.name + '"? Its past history stays in the records.')) return;
  products = products.filter(x => x.id !== p.id);
  saveData();
  document.getElementById("product-dialog").close();
  render();
  toast("Deleted");
});

// =====================================================
// 5. RECORD PAGE
// =====================================================

// One row per product. Typed values live in "cart", so redrawing never loses them.
function renderRecord() {
  const box = document.getElementById("cart-rows");
  box.innerHTML = "";

  cart.forEach((line, i) => {
    if (!findProduct(line.productId)) line.productId = null;
    const row = el("div", "cart-row");

    const select = el("select");
    select.required = true;
    select.setAttribute("aria-label", "Product");
    const blank = el("option", "", products.length ? "Choose a product" : "No products yet (add one in Stock)");
    blank.value = "";
    select.appendChild(blank);
    for (const p of products) {
      const option = el("option", "", p.name + " (" + p.stock + " " + p.unit + " left)");
      option.value = p.id;
      select.appendChild(option);
    }
    select.value = line.productId === null ? "" : line.productId;
    select.addEventListener("change", () => { line.productId = Number(select.value) || null; });

    const qty = el("input");
    qty.type = "number";
    qty.min = "1";
    qty.step = "1";
    qty.required = true;
    qty.placeholder = "Qty";
    qty.setAttribute("aria-label", "Quantity");
    qty.value = line.qty;
    qty.addEventListener("input", () => { line.qty = qty.value; });

    row.appendChild(select);
    row.appendChild(qty);

    if (cart.length > 1) {
      const remove = el("button", "cart-remove", "✕");
      remove.type = "button";
      remove.setAttribute("aria-label", "Remove this product");
      remove.addEventListener("click", () => { cart.splice(i, 1); renderRecord(); });
      row.appendChild(remove);
    }
    box.appendChild(row);
  });
}

// The cart as one line per product (the same product chosen twice is added together)
function cartLines() {
  const lines = [];
  for (const c of cart) {
    const product = findProduct(c.productId);
    const same = lines.find(l => l.product === product);
    if (same) same.qty += Number(c.qty);
    else lines.push({ product: product, qty: Number(c.qty) });
  }
  return lines;
}

document.querySelectorAll("#type-seg button").forEach(b => {
  b.addEventListener("click", () => {
    recordType = b.dataset.type;
    document.querySelectorAll("#type-seg button").forEach(x => x.classList.toggle("active", x === b));
  });
});

document.getElementById("add-line-btn").addEventListener("click", () => {
  cart.push({ productId: null, qty: "" });
  renderRecord();
});

// Save does not save yet: it opens the pop-up that asks the user to confirm
document.getElementById("move-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const lines = cartLines();

  if (recordType === "OUT") {
    const short = lines.find(l => l.qty > l.product.stock);
    if (short) {
      alert("Not enough " + short.product.name + ". Only " + short.product.stock + " " + short.product.unit + " left.");
      return;
    }
  }

  const list = document.getElementById("confirm-list");
  list.innerHTML = "";
  for (const { product, qty } of lines) {
    const after = product.stock + (recordType === "IN" ? qty : -qty);
    const li = el("li");
    const left = el("div");
    left.appendChild(el("div", "", product.name));
    left.appendChild(el("div", "small", "Stock " + product.stock + " → " + after + " " + product.unit));
    li.appendChild(left);
    li.appendChild(el("div", recordType === "IN" ? "plus" : "minus", (recordType === "IN" ? "+" : "-") + qty));
    list.appendChild(li);
  }

  const note = document.getElementById("move-note").value.trim();
  document.getElementById("confirm-title").textContent = "Confirm stock " + recordType;
  document.getElementById("confirm-note").textContent = note ? "Note: " + note : "";
  document.getElementById("confirm-dialog").showModal();
});

document.getElementById("confirm-back").addEventListener("click", () => document.getElementById("confirm-dialog").close());

document.getElementById("confirm-save").addEventListener("click", function () {
  const lines = cartLines();
  const note = document.getElementById("move-note").value.trim();

  for (const { product, qty } of lines) {
    const delta = recordType === "IN" ? qty : -qty;
    product.stock += delta;
    addMovement(product, recordType, delta, note);
  }

  saveData();
  cart = [{ productId: null, qty: "" }];
  document.getElementById("move-note").value = "";
  document.getElementById("confirm-dialog").close();
  render();
  toast("Saved " + lines.length + (lines.length === 1 ? " product" : " products"));
});

// Fill the product dropdowns (and remember what was selected)
function renderDropdowns() {
  fillSelect(document.getElementById("insight-product"));
  fillSelect(document.getElementById("history-product"));
}

function fillSelect(select) {
  const previous = select.value;
  select.innerHTML = "";
  const all = el("option", "", "All products");
  all.value = "";
  select.appendChild(all);
  for (const p of products) {
    const option = el("option", "", p.name);
    option.value = p.id;
    select.appendChild(option);
  }
  if ([...select.options].some(o => o.value === previous)) select.value = previous;
}

// =====================================================
// 6. INSIGHTS (graphs)
// =====================================================

// Make the empty "boxes" of the graph: 24 hours / 7 days / 30 days / 12 months
function buildBuckets(range) {
  const now = new Date();
  const buckets = [];
  const index = {};
  function add(key, label) {
    index[key] = buckets.length;
    buckets.push({ key: key, label: label, in: 0, out: 0 });
  }

  if (range === "day") {
    for (let h = 0; h < 24; h++) add(pad(h), h % 3 === 0 ? String(h) : "");
  } else if (range === "week" || range === "month") {
    const days = range === "week" ? 7 : 30;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const label = range === "week"
        ? d.toLocaleDateString("en-US", { weekday: "short" })
        : (i % 5 === 0 ? String(d.getDate()) : "");
      add(dateStr(d), label);
    }
  } else {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      add(d.getFullYear() + "-" + pad(d.getMonth() + 1), d.toLocaleDateString("en-US", { month: "short" }));
    }
  }
  return { buckets, index };
}

// Which box does a movement belong to?
function bucketKey(range, m) {
  if (range === "day") return m.date === todayString() ? (m.time || "00:00").slice(0, 2) : null;
  if (range === "year") return m.date.slice(0, 7);
  return m.date;
}

// Add up all movements into the boxes
function summarize(range, productId) {
  const { buckets, index } = buildBuckets(range);
  const perProduct = {};
  let totalIn = 0, totalOut = 0;

  for (const m of movements) {
    if (m.type !== "IN" && m.type !== "OUT") continue;       // corrections are not counted
    if (productId && m.productId !== productId) continue;
    const key = bucketKey(range, m);
    if (key === null || !(key in index)) continue;

    const b = buckets[index[key]];
    if (m.type === "IN") { b.in += m.qty; totalIn += m.qty; }
    else {
      b.out += m.qty; totalOut += m.qty;
      perProduct[m.productName] = (perProduct[m.productName] || 0) + m.qty;
    }
  }
  return { buckets, totalIn, totalOut, perProduct };
}

function renderInsights() {
  const productId = Number(document.getElementById("insight-product").value) || null;
  const s = summarize(currentRange, productId);

  document.getElementById("chart-title").textContent = RANGE_TITLES[currentRange];
  drawChart(document.getElementById("insight-chart"), s.buckets);

  document.getElementById("ins-in").textContent = s.totalIn;
  document.getElementById("ins-out").textContent = s.totalOut;
  const net = s.totalIn - s.totalOut;
  document.getElementById("ins-net").textContent = (net > 0 ? "+" : "") + net;
  document.getElementById("ins-hint").textContent = productId
    ? ""
    : "Different units (kg, pcs...) are added together here. Choose one product above for exact numbers.";

  // Top list (only when "All products" is selected)
  const topCard = document.getElementById("top-card");
  topCard.style.display = productId ? "none" : "block";
  const list = document.getElementById("top-list");
  list.innerHTML = "";
  const top = Object.entries(s.perProduct).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (top.length === 0) list.appendChild(el("li", "empty", "No OUT movements in this period."));
  for (const [name, value] of top) {
    const li = el("li", "top-item");
    const line = el("div", "line");
    line.appendChild(el("span", "", name));
    line.appendChild(el("b", "", String(value)));
    const bg = el("div", "bar-bg");
    const fill = el("div", "bar-fill");
    fill.style.width = (value / top[0][1] * 100) + "%";
    bg.appendChild(fill);
    li.appendChild(line);
    li.appendChild(bg);
    list.appendChild(li);
  }
}

document.querySelectorAll("#range-seg button").forEach(b => {
  b.addEventListener("click", () => {
    currentRange = b.dataset.range;
    document.querySelectorAll("#range-seg button").forEach(x => x.classList.toggle("active", x === b));
    renderInsights();
  });
});
document.getElementById("insight-product").addEventListener("change", renderInsights);

// ---------- drawing the graph (plain SVG, no extra libraries needed) ----------

function niceStep(raw) {
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / mag;
  const f = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return f * mag;
}

function drawChart(container, buckets) {
  const W = 600, H = 260, L = 38, R = 8, T = 10, B = 28;
  const pw = W - L - R, ph = H - T - B;

  let maxVal = 1;
  for (const b of buckets) maxVal = Math.max(maxVal, b.in, b.out);
  const step = niceStep(maxVal / 4);
  const top = step * 4;

  let s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Stock in and out chart">';

  // Grid lines and numbers on the left
  for (let i = 0; i <= 4; i++) {
    const y = T + ph - (i / 4) * ph;
    s += '<line class="grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '"/>';
    s += '<text class="axis" x="' + (L - 6) + '" y="' + (y + 4) + '" text-anchor="end">' + (Math.round(step * i * 100) / 100) + "</text>";
  }

  // Two bars (IN and OUT) for each box
  const n = buckets.length;
  const gw = pw / n;
  const bw = Math.max(2, Math.min(18, gw * 0.36));
  buckets.forEach((b, i) => {
    const gx = L + i * gw + gw / 2;
    const hIn = b.in / top * ph;
    const hOut = b.out / top * ph;
    s += '<rect class="bar-in" x="' + (gx - bw - 1) + '" y="' + (T + ph - hIn) + '" width="' + bw + '" height="' + hIn + '" rx="2"><title>' + b.key + " IN: " + b.in + "</title></rect>";
    s += '<rect class="bar-out" x="' + (gx + 1) + '" y="' + (T + ph - hOut) + '" width="' + bw + '" height="' + hOut + '" rx="2"><title>' + b.key + " OUT: " + b.out + "</title></rect>";
    if (b.label) s += '<text class="axis" x="' + gx + '" y="' + (H - 8) + '" text-anchor="middle">' + b.label + "</text>";
  });

  s += "</svg>";
  container.innerHTML = s;
}

// =====================================================
// 7. HISTORY (graph and log table)
// =====================================================

function renderHistory() {
  const productId = Number(document.getElementById("history-product").value) || null;
  const { index } = buildBuckets(historyRange);

  // Newest first, keeping only what the filters ask for
  const rows = movements.filter(m => {
    const key = bucketKey(historyRange, m);
    if (key === null || !(key in index)) return false;
    if (productId && m.productId !== productId) return false;
    return historyType === "ALL" || m.type === historyType;
  }).reverse();

  // Graph
  const buckets = summarize(historyRange, productId).buckets.map(b => ({
    key: b.key, label: b.label,
    in: historyType === "OUT" ? 0 : b.in,
    out: historyType === "IN" ? 0 : b.out
  }));
  document.getElementById("history-title").textContent = RANGE_TITLES[historyRange];
  drawChart(document.getElementById("history-chart"), buckets);

  // Totals: for the whole period and for each day
  const days = {};
  let totalIn = 0, totalOut = 0;
  for (const m of rows) {
    const day = days[m.date] || (days[m.date] = { in: 0, out: 0 });
    if (m.type === "IN") { day.in += m.qty; totalIn += m.qty; }
    if (m.type === "OUT") { day.out += m.qty; totalOut += m.qty; }
  }
  document.getElementById("hist-in").textContent = totalIn;
  document.getElementById("hist-out").textContent = totalOut;
  document.getElementById("hist-count").textContent = rows.length;

  // Log table, one block for each day
  const body = document.getElementById("history-rows");
  body.innerHTML = "";
  if (rows.length === 0) {
    const tr = el("tr");
    const td = el("td", "empty", "Nothing recorded in this period.");
    td.colSpan = 5;
    tr.appendChild(td);
    body.appendChild(tr);
  }

  const labels = { IN: "IN", OUT: "OUT", ADJUST: "Fix" };
  let lastDate = null;
  for (const m of rows.slice(0, historyLimit)) {
    if (m.date !== lastDate) {
      lastDate = m.date;
      const head = el("tr", "day-row");
      const td = el("td");
      td.colSpan = 5;
      const line = el("div", "line");
      line.appendChild(el("span", "", new Date(m.date + "T00:00").toDateString()));
      const sums = el("span");
      sums.appendChild(el("span", "plus", "+" + days[m.date].in));
      sums.appendChild(document.createTextNode("  "));
      sums.appendChild(el("span", "minus", "-" + days[m.date].out));
      line.appendChild(sums);
      td.appendChild(line);
      head.appendChild(td);
      body.appendChild(head);
    }

    const d = deltaOf(m);
    const tr = el("tr");
    tr.appendChild(el("td", "small", m.time || ""));
    const name = el("td");
    name.appendChild(el("div", "", m.productName));
    if (m.note) name.appendChild(el("div", "small", m.note));
    tr.appendChild(name);
    tr.appendChild(el("td", "", "")).appendChild(el("span", "badge " + m.type.toLowerCase(), labels[m.type] || m.type));
    tr.appendChild(el("td", "num " + (m.type === "ADJUST" ? "adj" : (d >= 0 ? "plus" : "minus")), (d > 0 ? "+" : "") + d));
    tr.appendChild(el("td", "num", m.stockAfter === undefined ? "" : String(m.stockAfter)));
    body.appendChild(tr);
  }

  document.getElementById("history-more").style.display = rows.length > historyLimit ? "block" : "none";
}

function changeHistoryFilter() {
  historyLimit = 100;
  renderHistory();
}

document.querySelectorAll("#history-range button").forEach(b => {
  b.addEventListener("click", () => {
    historyRange = b.dataset.range;
    document.querySelectorAll("#history-range button").forEach(x => x.classList.toggle("active", x === b));
    changeHistoryFilter();
  });
});
document.querySelectorAll("#history-type button").forEach(b => {
  b.addEventListener("click", () => {
    historyType = b.dataset.type;
    document.querySelectorAll("#history-type button").forEach(x => x.classList.toggle("active", x === b));
    changeHistoryFilter();
  });
});
document.getElementById("history-product").addEventListener("change", changeHistoryFilter);
document.getElementById("history-more").addEventListener("click", () => {
  historyLimit += 100;
  renderHistory();
});

// =====================================================
// 8. SETTINGS (export to Excel, sample data, clear)
// =====================================================

function downloadCSV(filename, rows) {
  const text = rows.map(r => r.map(cell => {
    const v = String(cell === undefined || cell === null ? "" : cell);
    return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }).join(",")).join("\r\n");

  // The \ufeff at the start makes Excel read Chinese characters correctly
  const blob = new Blob(["\ufeff" + text], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

document.getElementById("export-stock").addEventListener("click", () => {
  const rows = [["Name", "Kind", "Unit", "Stock now", "Warning level"]];
  for (const p of products) rows.push([p.name, p.kind === "material" ? "Material" : "Finished product", p.unit, p.stock, p.min]);
  downloadCSV("stock-" + todayString() + ".csv", rows);
});

document.getElementById("export-history").addEventListener("click", () => {
  const labels = { IN: "IN", OUT: "OUT", ADJUST: "Correction" };
  const rows = [["Date", "Time", "Product", "Type", "Quantity", "Change", "Stock after", "Note"]];
  for (const m of movements) rows.push([m.date, m.time, m.productName, labels[m.type] || m.type, m.qty, deltaOf(m), m.stockAfter, m.note]);
  downloadCSV("history-" + todayString() + ".csv", rows);
});

document.getElementById("clear-btn").addEventListener("click", () => {
  if (!confirm("Delete ALL products and history on this device? This cannot be undone.")) return;
  products = [];
  movements = [];
  saveData();
  render();
  toast("All data deleted");
});

document.getElementById("demo-btn").addEventListener("click", () => {
  if (!confirm("This replaces everything currently saved with sample data. Continue?")) return;

  const demo = [
    { name: "Material A", kind: "material", unit: "kg", min: 30, base: 8 },
    { name: "Material B", kind: "material", unit: "kg", min: 30, base: 6 },
    { name: "Packaging box", kind: "material", unit: "pcs", min: 100, base: 20 },
    { name: "Product X", kind: "product", unit: "pcs", min: 20, base: 10 },
    { name: "Product Y", kind: "product", unit: "pcs", min: 20, base: 7 },
    { name: "Product Z", kind: "product", unit: "pcs", min: 15, base: 4 }
  ];
  products = demo.map((d, i) => ({ id: Date.now() + i, name: d.name, kind: d.kind, unit: d.unit, stock: 0, min: d.min }));
  movements = [];

  const today = new Date();
  for (let back = 364; back >= 0; back--) {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - back);
    const weekend = day.getDay() === 0 || day.getDay() === 6;
    const dayMoves = [];

    products.forEach((p, i) => {
      if (Math.random() < (weekend ? 0.4 : 0.8)) {
        const want = Math.max(1, Math.round(demo[i].base * (0.5 + Math.random())));
        const make = (type, qty) => {
          p.stock += type === "IN" ? qty : -qty;
          dayMoves.push({
            date: dateStr(day), productId: p.id, productName: p.name, type: type, qty: qty,
            delta: type === "IN" ? qty : -qty, note: "", stockAfter: p.stock
          });
        };
        if (p.stock < want) make("IN", want * (4 + Math.floor(Math.random() * 4)));
        make("OUT", want);
      }
    });

    // Give each movement of the day a time, in order
    const minutes = dayMoves.map(() => 480 + Math.floor(Math.random() * 720)).sort((a, b) => a - b);
    dayMoves.forEach((m, k) => {
      m.time = pad(Math.floor(minutes[k] / 60)) + ":" + pad(minutes[k] % 60);
      movements.push(m);
    });
  }

  saveData();
  render();
  toast("Sample data loaded");
});

// =====================================================
// 9. START
// =====================================================

document.querySelectorAll("nav button").forEach(b => {
  b.addEventListener("click", () => showPage(b.dataset.page));
});

// Stay logged in until the browser tab is closed
const savedUser = USERS.find(u => u.username === sessionStorage.getItem("user"));
if (savedUser) startSession(savedUser);
