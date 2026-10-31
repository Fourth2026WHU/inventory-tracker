// =====================================================
// 1. DATA
// Two lists: products, and movements (every IN / OUT / correction).
// They are saved in the Supabase database, so every device sees the same data.
// The lists here are only a copy of what the server last sent.
//
// Access "full" sees everything, "limited" only sees Home totals, Stock and Record.
// Hiding pages here is only for tidiness. The real rules are in supabase/schema.sql:
// the server never sends movements to a limited account.
// =====================================================

let products = [];
let movements = [];                  // stays empty for limited accounts
let todayTotals = { in: 0, out: 0 }; // comes from the server, because limited accounts have no movements

const configured = SUPABASE_URL.startsWith("https://") && !!window.supabase;
// The login lasts until the browser tab is closed
const db = configured
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { storage: window.sessionStorage } })
  : null;

const FULL_ONLY_PAGES = ["history", "insights", "settings"];
const PAGE_SIZE = 1000;       // the most rows Supabase sends in one reply
const CHECK_EVERY_MS = 60000; // how often an open app looks for changes from other devices
const PICKER_MAX_ROWS = 50;   // how many products the Record list shows at once
const LIST_MAX_ROWS = 8;      // how many rows each Insights list shows
const SPEED_DAYS = 30;        // selling speed is worked out from this many recent days
const RANGE_TITLES = { day: "Today, hour by hour", week: "Last 7 days", month: "Last 30 days", year: "Last 12 months" };
const RANGE_DAYS = { day: 1, week: 7, month: 30, year: 365 };
const COMPARE_LABELS = { day: "yesterday", week: "the 7 days before", month: "the 30 days before", year: "the year before" };

let currentUser = null;     // the account that is logged in
let recordType = "IN";      // which button is selected on the Record page
let recordContact = "";     // the customer or supplier typed on the Record page
let cart = [newCartLine()]; // the product lines on the Record page
let contacts = [];          // the customer and supplier names to choose from
let reorder = { now: 14, soon: 21 }; // reorder warning levels, in days of stock left
let notMovingDays = 30;     // which button is selected in the Not moving list
let currentRange = "week";  // which button is selected on the Insights page
let historyRange = "week";  // which buttons are selected on the History page
let historyType = "ALL";
let historyLimit = 100;     // how many log rows to show
let editingId = null;       // null = adding a product, otherwise the id being edited
let confirmLines = [];      // the lines shown in the confirm pop-up
let saving = false;         // true while a save is on its way, so a double tap cannot save twice

// Get the movements a few pages at a time, oldest first
async function fetchAllMovements() {
  const all = [];
  while (true) {
    const { data, error } = await db.from("movements")
      .select("id,date:move_date,time:move_time,productId:product_id,productName:product_name,type,qty,delta,note,stockAfter:stock_after,unitPrice:unit_price,unitCost:unit_cost,contact")
      .order("id")
      .range(all.length, all.length + PAGE_SIZE - 1);
    if (error) throw error;
    all.push(...data);
    if (data.length < PAGE_SIZE) return addProfit(all);
  }
}

// Work out the sales and profit of each OUT. The cost is the average of
// everything paid for that product up to that day.
function addProfit(list) {
  const paid = {};
  for (const m of list) {
    const p = paid[m.productId] || (paid[m.productId] = { qty: 0, cost: 0 });
    if (m.type === "IN" && m.unitCost !== null) {
      p.qty += m.qty;
      p.cost += m.qty * m.unitCost;
    }
    if (m.type === "OUT" && m.unitPrice !== null) {
      m.sales = m.qty * m.unitPrice;
      if (p.qty > 0) m.profit = m.sales - m.qty * (p.cost / p.qty);
    }
  }
  return list;
}

// Get the latest data from the server
async function loadData() {
  const [items, totals, names] = await Promise.all([
    db.from("products").select("id,name,kind,unit,stock,min:min_stock").order("id"),
    db.rpc("today_totals"),
    db.from("contacts").select("kind,name").order("name")
  ]);
  if (items.error) throw items.error;
  if (totals.error) throw totals.error;
  if (names.error) throw names.error;
  products = items.data;
  todayTotals = totals.data;
  contacts = names.data;

  if (isFull()) {
    const { data: levels, error: levelsError } = await db.from("app_settings").select("order_now_days,order_soon_days").maybeSingle();
    if (levelsError) throw levelsError;
    if (levels) reorder = { now: levels.order_now_days, soon: levels.order_soon_days };

    // History is never edited, so the same number of rows means nothing changed
    const { count, error } = await db.from("movements").select("id", { count: "exact", head: true });
    if (error) throw error;
    if (count !== movements.length) movements = await fetchAllMovements();
  }
}

// Run one of the save functions in supabase/schema.sql, then show the new data
async function saveToServer(name, args, message) {
  saving = true;
  const { error } = await db.rpc(name, args);
  if (error) alert(t("Not saved. {reason}", { reason: serverText(error.message) }));
  try { await loadData(); }
  catch (e) { toast(t("Could not refresh the data")); }
  saving = false;
  render();
  if (!error) toast(message);
  return !error;
}

// ---------- small helpers ----------

function pad(n) { return String(n).padStart(2, "0"); }

// Date as text: "2026-10-30"
function dateStr(d) {
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}
function todayString() { return dateStr(new Date()); }

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

// A number as text, with commas and at most 2 decimals: 1,250.5
function money(n) { return Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 }); }

// A date for people to read: Sat Oct 31 2026
function longDate(d) {
  return d.toLocaleDateString(dateLocale(), { weekday: "short", year: "numeric", month: "short", day: "numeric" });
}

// The date a number of days ago, as text
function dateBack(days) {
  const d = new Date();
  return dateStr(new Date(d.getFullYear(), d.getMonth(), d.getDate() - days));
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

// After a login: find out who this is, get the data and open the app.
// The server only lets each account read its own profile.
async function startSession() {
  const loginError = document.getElementById("login-error");
  try {
    const { data: profile, error } = await db.from("profiles").select("name,access").maybeSingle();
    if (error) throw error;
    if (!profile) {
      await db.auth.signOut({ scope: "local" });
      loginError.textContent = t("This account has no access yet. Ask the owner to set it up.");
      return;
    }
    currentUser = profile;
    await loadData();
  } catch (e) {
    currentUser = null;
    await db.auth.signOut({ scope: "local" });
    loginError.textContent = t("Could not reach the database. Try again in a minute.");
    return;
  }

  document.body.classList.remove("logged-out");
  document.body.classList.toggle("limited", !isFull());
  showUserName();
  showPage("home");
}

function showUserName() {
  document.getElementById("user-name").textContent = isFull() ? currentUser.name : t("{name} (limited)", { name: currentUser.name });
}

function endSession() {
  currentUser = null;
  products = [];
  movements = [];
  todayTotals = { in: 0, out: 0 };
  document.body.classList.add("logged-out");
  document.getElementById("login-user").value = "";
}

document.getElementById("login-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  if (!db) return;
  const username = document.getElementById("login-user").value.trim().toLowerCase();
  const password = document.getElementById("login-pass").value;
  const loginError = document.getElementById("login-error");
  const button = this.querySelector("button[type=submit]");

  button.disabled = true;
  loginError.textContent = "";
  const email = username.includes("@") ? username : username + LOGIN_EMAIL_ENDING;
  const { error } = await db.auth.signInWithPassword({ email, password });
  document.getElementById("login-pass").value = "";

  if (!error) await startSession();
  else if (error.code === "email_not_confirmed") loginError.textContent = t("This account is not confirmed yet. Ask the owner to confirm it in Supabase.");
  else loginError.textContent = error.status === 400 ? t("Wrong username or password.") : t("Could not reach the server. Try again.");
  button.disabled = false;
});

document.getElementById("logout-btn").addEventListener("click", function () {
  if (confirm(t("Log out?"))) db.auth.signOut({ scope: "local" });
});

function showPage(name) {
  if (!isFull() && FULL_ONLY_PAGES.includes(name)) name = "home";
  document.body.classList.toggle("wide", name === "insights");
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
    if (!document.getElementById("reorder-form").contains(document.activeElement)) showReorderSettings();
  }
}

// =====================================================
// 3. HOME
// =====================================================

function renderHome() {
  document.getElementById("today-date").textContent = longDate(new Date());

  const low = products.filter(p => p.stock > 0 && p.stock < p.min).length;
  const out = products.filter(p => p.stock <= 0).length;
  document.getElementById("stat-total").textContent = products.length;
  document.getElementById("stat-low").textContent = low;
  document.getElementById("stat-out").textContent = out;

  // Today's totals
  document.getElementById("total-in").textContent = todayTotals.in;
  document.getElementById("total-out").textContent = todayTotals.out;

  // Small chart of the last 7 days
  if (isFull()) drawChart(document.getElementById("home-chart"), summarize("week", null).buckets);

  // Products that need attention
  const list = document.getElementById("attention-list");
  list.innerHTML = "";
  const needs = products.filter(p => p.stock < p.min);
  if (needs.length === 0) {
    list.appendChild(el("li", "empty", products.length ? t("All products have enough stock.") : t("No products yet. Go to Stock and add one.")));
  }
  for (const p of needs) {
    const li = el("li");
    li.appendChild(el("div", "", p.name));
    const right = el("div", "qty " + (p.stock <= 0 ? "minus" : "low"));
    right.textContent = (p.stock <= 0 ? t("Out of stock") : t("Low: {n} {unit}", { n: p.stock, unit: p.unit }));
    li.appendChild(right);
    list.appendChild(li);
  }

  // Recent activity
  const recent = document.getElementById("recent-list");
  recent.innerHTML = "";
  if (!isFull()) return;
  if (movements.length === 0) recent.appendChild(el("li", "empty", t("Nothing recorded yet.")));
  for (const m of movements.slice(-8).reverse()) recent.appendChild(makeMoveRow(m));
}

// One line in the recent activity list
function makeMoveRow(m) {
  const li = el("li");
  const left = el("div");
  left.appendChild(el("div", "", m.productName));
  const info = [m.date, m.time, m.contact, m.note].filter(Boolean).join(" · ");
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
    list.appendChild(el("li", "empty", products.length ? t("No product matches your search.") : t("No products yet. Tap + Add product.")));
    return;
  }

  for (const p of shown) {
    // Only products that need attention get a colour and a label
    const state = p.stock <= 0 ? "out" : p.stock < p.min ? "low" : "";
    const li = el("li", "stock-row" + (state ? " need-" + state : "") + (isFull() ? " clickable" : ""));

    const left = el("div");
    left.appendChild(el("div", "", p.name));
    left.appendChild(el("div", "small", t("{kind} · warn below {min}", { kind: t(p.kind === "material" ? "Material" : "Finished product"), min: p.min })));

    const right = el("div", "right");
    right.appendChild(el("div", "qty", p.stock + " " + p.unit));
    if (state) right.appendChild(el("span", "badge " + state, t(state === "out" ? "Out of stock" : "Low stock")));

    li.appendChild(left);
    li.appendChild(right);
    if (isFull()) li.addEventListener("click", () => openProductDialog(p.id));
    list.appendChild(li);
  }
}

function openProductDialog(id) {
  editingId = id;
  const p = id === null ? null : findProduct(id);

  document.getElementById("dialog-title").textContent = p ? t("Edit product") : t("Add product");
  document.getElementById("p-name").value = p ? p.name : "";
  document.getElementById("p-kind").value = p ? p.kind : "material";
  document.getElementById("p-unit").value = p ? p.unit : "pcs";
  document.getElementById("p-stock").value = p ? p.stock : 0;
  document.getElementById("p-min").value = p ? p.min : 5;
  document.getElementById("p-stock-label").textContent = p
    ? t("Stock now (change it only to fix a mistake)")
    : t("Starting stock");
  document.getElementById("p-delete").style.display = p ? "block" : "none";

  document.getElementById("product-dialog").showModal();
}

document.getElementById("add-product-btn").addEventListener("click", () => openProductDialog(null));
document.getElementById("stock-search").addEventListener("input", renderStock);
document.getElementById("p-cancel").addEventListener("click", () => document.getElementById("product-dialog").close());

// Save (add or edit)
// A changed stock number is saved in the history as a correction (see save_product)
document.getElementById("product-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  if (saving) return;

  const saved = await saveToServer("save_product", {
    p_id: editingId,
    p_name: document.getElementById("p-name").value.trim(),
    p_kind: document.getElementById("p-kind").value,
    p_unit: document.getElementById("p-unit").value.trim(),
    p_stock: Number(document.getElementById("p-stock").value),
    p_min: Number(document.getElementById("p-min").value)
  }, t("Saved"));
  if (saved) document.getElementById("product-dialog").close();
});

// Delete
document.getElementById("p-delete").addEventListener("click", async function () {
  const p = findProduct(editingId);
  if (!p || saving) return;
  if (!confirm(t('Delete "{name}" for everyone? Its past history stays in the records.', { name: p.name }))) return;
  const saved = await saveToServer("delete_product", { p_id: p.id }, t("Deleted"));
  if (saved) document.getElementById("product-dialog").close();
});

// =====================================================
// 5. RECORD PAGE
// =====================================================

function newCartLine() { return { productId: null, qty: "", price: "" }; }

// A box to type in, with a list of matching names under it.
// With "free" any text is allowed, otherwise something must be chosen from the list.
function makePicker({ label, placeholder, startText, items, detail, free, onType, onChoose }) {
  const box = el("div", "picker");
  const input = el("input");
  const menu = el("ul", "picker-menu");
  let matches = [];
  let filtering = false; // false shows the whole list, true shows only what matches the text
  let active = -1;       // the row picked with the arrow keys

  input.type = "text";
  input.autocomplete = "off";
  input.placeholder = placeholder;
  input.setAttribute("aria-label", label);
  input.value = startText;
  menu.hidden = true;

  function closeMenu() {
    menu.hidden = true;
    active = -1;
  }

  function choose(item) {
    input.value = item.name;
    filtering = false;
    onChoose(item, input);
    closeMenu();
  }

  function fillMenu() {
    const typed = filtering ? input.value.trim().toLowerCase() : "";
    const found = items.filter(item => item.name.toLowerCase().includes(typed));
    matches = found.slice(0, PICKER_MAX_ROWS);

    menu.innerHTML = "";
    if (found.length === 0) {
      if (free) return closeMenu();
      menu.appendChild(el("li", "empty", t("No product matches.")));
    }
    matches.forEach((item, i) => {
      const li = el("li", i === active ? "active" : "");
      li.appendChild(el("span", "", item.name));
      if (detail) li.appendChild(el("span", "small", detail(item)));
      li.addEventListener("mousedown", event => event.preventDefault()); // keeps the box focused
      li.addEventListener("click", () => choose(item));
      menu.appendChild(li);
    });
    if (found.length > matches.length) menu.appendChild(el("li", "empty", t("Keep typing to see more.")));
    menu.hidden = false;
    const row = menu.children[active];
    if (row) row.scrollIntoView({ block: "nearest" });
  }

  input.addEventListener("focus", () => { filtering = false; input.select(); fillMenu(); });
  input.addEventListener("click", fillMenu);
  input.addEventListener("blur", closeMenu);
  input.addEventListener("input", () => {
    filtering = true;
    active = -1;
    onType(input.value, input);
    fillMenu();
  });
  input.addEventListener("keydown", event => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      active = Math.max(0, Math.min(matches.length - 1, active + step));
      fillMenu();
    } else if (event.key === "Enter" && !menu.hidden) {
      event.preventDefault(); // Enter picks from the list here, it does not save the form
      const pick = matches[free ? active : Math.max(active, 0)];
      if (pick) choose(pick);
      else closeMenu();
    } else if (event.key === "Escape") {
      closeMenu();
    }
  });

  box.appendChild(input);
  box.appendChild(menu);
  return box;
}

function makeProductPicker(line) {
  // The form cannot be saved until a real product is chosen
  function checkChosen(input) {
    input.setCustomValidity(line.productId === null ? t("Choose a product from the list") : "");
  }

  const chosen = findProduct(line.productId);
  const box = makePicker({
    label: t("Product"),
    placeholder: products.length ? t("Type or choose a product") : t("No products yet (add one in Stock)"),
    startText: chosen ? chosen.name : "",
    items: products,
    detail: p => t("{n} {unit} left", { n: p.stock, unit: p.unit }),
    onType(text, input) {
      const exact = products.find(p => p.name.toLowerCase() === text.trim().toLowerCase());
      line.productId = exact ? exact.id : null;
      checkChosen(input);
    },
    onChoose(p, input) {
      line.productId = p.id;
      checkChosen(input);
    }
  });

  const input = box.querySelector("input");
  input.required = true;
  checkChosen(input);
  return box;
}

// The optional customer (OUT) or supplier (IN) box. New names are saved with the record.
function renderContactBox() {
  const kind = recordType === "OUT" ? "customer" : "supplier";
  document.getElementById("contact-label").textContent = t(kind === "customer" ? "Customer (optional)" : "Supplier (optional)");
  const box = document.getElementById("contact-box");
  box.innerHTML = "";
  box.appendChild(makePicker({
    label: t(kind === "customer" ? "Customer" : "Supplier"),
    placeholder: t("Type or choose a name"),
    startText: recordContact,
    items: contacts.filter(c => c.kind === kind),
    free: true,
    onType(text) { recordContact = text; },
    onChoose(c) { recordContact = c.name; }
  }));
}

// One row per product. Typed values live in "cart", so redrawing never loses them.
function renderRecord() {
  const box = document.getElementById("cart-rows");
  box.innerHTML = "";
  renderContactBox();

  cart.forEach((line, i) => {
    if (!findProduct(line.productId)) line.productId = null;
    const row = el("div", "cart-row");

    const qty = el("input");
    qty.type = "number";
    qty.min = "1";
    qty.step = "1";
    qty.required = true;
    qty.placeholder = t("Qty");
    qty.setAttribute("aria-label", t("Quantity"));
    qty.value = line.qty;
    qty.addEventListener("input", () => { line.qty = qty.value; });

    const price = el("input");
    price.type = "number";
    price.min = "0";
    price.step = "any";
    price.placeholder = t(recordType === "OUT" ? "Price each" : "Cost each");
    price.setAttribute("aria-label", price.placeholder);
    price.value = line.price;
    price.addEventListener("input", () => { line.price = price.value; });

    row.appendChild(makeProductPicker(line));
    row.appendChild(qty);
    row.appendChild(price);

    if (cart.length > 1) {
      const remove = el("button", "cart-remove", "✕");
      remove.type = "button";
      remove.setAttribute("aria-label", t("Remove this product"));
      remove.addEventListener("click", () => { cart.splice(i, 1); renderRecord(); });
      row.appendChild(remove);
    }
    box.appendChild(row);
  });
}

// The cart as one line per product and price (the same product chosen twice is added together)
function cartLines() {
  const lines = [];
  for (const c of cart) {
    const product = findProduct(c.productId);
    const price = c.price === "" ? null : Number(c.price);
    const same = lines.find(l => l.product === product && l.price === price);
    if (same) same.qty += Number(c.qty);
    else lines.push({ product: product, qty: Number(c.qty), price: price });
  }
  return lines;
}

// How much of a product the whole cart moves, across all its lines
function cartQty(lines, product) {
  return lines.filter(l => l.product === product).reduce((sum, l) => sum + l.qty, 0);
}

document.querySelectorAll("#type-seg button").forEach(b => {
  b.addEventListener("click", () => {
    recordType = b.dataset.type;
    recordContact = "";
    document.querySelectorAll("#type-seg button").forEach(x => x.classList.toggle("active", x === b));
    renderRecord();
  });
});

document.getElementById("add-line-btn").addEventListener("click", () => {
  cart.push(newCartLine());
  renderRecord();
});

// Save does not save yet: it opens the pop-up that asks the user to confirm
document.getElementById("move-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const lines = cartLines();

  if (lines.some(l => !l.product)) {
    renderRecord();
    alert(t("A product was deleted on another device. Please check the list."));
    return;
  }

  if (recordType === "OUT") {
    const short = lines.find(l => cartQty(lines, l.product) > l.product.stock);
    if (short) {
      alert(t("Not enough {name}. Only {n} {unit} left.", { name: short.product.name, n: short.product.stock, unit: short.product.unit }));
      return;
    }
  }

  const list = document.getElementById("confirm-list");
  list.innerHTML = "";
  for (const { product, qty, price } of lines) {
    const moved = cartQty(lines, product);
    const after = product.stock + (recordType === "IN" ? moved : -moved);
    const li = el("li");
    const left = el("div");
    left.appendChild(el("div", "", product.name));
    left.appendChild(el("div", "small", t("Stock {before} → {after} {unit}", { before: product.stock, after: after, unit: product.unit })));
    if (price !== null) left.appendChild(el("div", "small", qty + " × " + money(price) + " = " + money(qty * price)));
    li.appendChild(left);
    li.appendChild(el("div", recordType === "IN" ? "plus" : "minus", (recordType === "IN" ? "+" : "-") + qty));
    list.appendChild(li);
  }

  const contact = recordContact.trim();
  const note = document.getElementById("move-note").value.trim();
  const total = lines.reduce((sum, l) => sum + l.qty * (l.price || 0), 0);
  const details = [
    total ? t("Total: {n}", { n: money(total) }) : "",
    contact ? t(recordType === "OUT" ? "Customer: {name}" : "Supplier: {name}", { name: contact }) : "",
    note ? t("Note: {text}", { text: note }) : ""
  ];
  document.getElementById("confirm-title").textContent = t("Confirm stock {type}", { type: t(recordType) });
  document.getElementById("confirm-note").textContent = details.filter(Boolean).join(" · ");
  confirmLines = lines;
  document.getElementById("confirm-dialog").showModal();
});

document.getElementById("confirm-back").addEventListener("click", () => document.getElementById("confirm-dialog").close());

// The server checks the stock again, in case another device saved first
document.getElementById("confirm-save").addEventListener("click", async function () {
  if (saving) return;
  const count = confirmLines.length;
  const saved = await saveToServer("record_cart", {
    p_type: recordType,
    p_lines: confirmLines.map(l => ({ product_id: l.product.id, qty: l.qty, price: l.price })),
    p_note: document.getElementById("move-note").value.trim(),
    p_contact: recordContact.trim()
  }, count === 1 ? t("Saved 1 product") : t("Saved {n} products", { n: count }));

  document.getElementById("confirm-dialog").close();
  if (!saved) return;
  cart = [newCartLine()];
  recordContact = "";
  document.getElementById("move-note").value = "";
  renderRecord();
});

// Fill the product dropdowns (and remember what was selected)
function renderDropdowns() {
  fillSelect(document.getElementById("insight-product"));
  fillSelect(document.getElementById("history-product"));
}

function fillSelect(select) {
  const previous = select.value;
  select.innerHTML = "";
  const all = el("option", "", t("All products"));
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
    buckets.push({ key: key, label: label, in: 0, out: 0, sales: 0, profit: 0 });
  }

  if (range === "day") {
    for (let h = 0; h < 24; h++) add(pad(h), h % 3 === 0 ? String(h) : "");
  } else if (range === "week" || range === "month") {
    const days = range === "week" ? 7 : 30;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const label = range === "week"
        ? d.toLocaleDateString(dateLocale(), { weekday: "short" })
        : (i % 5 === 0 ? String(d.getDate()) : "");
      add(dateStr(d), label);
    }
  } else {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      add(d.getFullYear() + "-" + pad(d.getMonth() + 1), d.toLocaleDateString(dateLocale(), { month: "short" }));
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
  const perProduct = {}, perProfit = {}, perCustomer = {};
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
      b.sales += m.sales || 0;
      b.profit += m.profit || 0;
      perProduct[m.productName] = (perProduct[m.productName] || 0) + m.qty;
      if (m.profit !== undefined) perProfit[m.productName] = (perProfit[m.productName] || 0) + m.profit;
      if (m.contact) {
        const c = perCustomer[m.contact] || (perCustomer[m.contact] = { sales: 0, units: 0, orders: 0 });
        c.sales += m.sales || 0;
        c.units += m.qty;
        c.orders++;
      }
    }
  }
  return { buckets, totalIn, totalOut, perProduct, perProfit, perCustomer };
}

// Add up one period. periodsBack 0 is the current period, 1 is the one before it.
function periodTotals(range, productId, periodsBack) {
  const days = RANGE_DAYS[range];
  const to = dateBack(days * periodsBack);
  const from = dateBack(days * periodsBack + days - 1);
  const totals = { units: 0, sales: 0, profit: 0, missing: 0 };

  for (const m of movements) {
    if (m.type !== "OUT" || m.date < from || m.date > to) continue;
    if (productId && m.productId !== productId) continue;
    totals.units += m.qty;
    totals.sales += m.sales || 0;
    totals.profit += m.profit || 0;
    // Materials are used, not sold, so they have no selling price
    const product = findProduct(m.productId);
    if (m.profit === undefined && !(product && product.kind === "material")) totals.missing++;
  }
  return totals;
}

// Text such as "▲ 12% from yesterday"
function showChange(id, now, before) {
  const box = document.getElementById(id);
  box.className = "change";
  box.textContent = "";
  if (before <= 0) return;
  const percent = Math.round((now - before) / before * 100);
  box.classList.add(percent >= 0 ? "ok" : "minus");
  box.textContent = (percent >= 0 ? "▲ " : "▼ ") + t("{percent}% from {period}", { percent: Math.abs(percent), period: t(COMPARE_LABELS[currentRange]) });
}

// Products that will run out soon at their recent selling speed, soonest first
function reorderList() {
  const from = dateBack(SPEED_DAYS - 1);
  const sold = {};
  for (const m of movements) {
    if (m.type === "OUT" && m.date >= from) sold[m.productId] = (sold[m.productId] || 0) + m.qty;
  }
  return products
    .filter(p => sold[p.id])
    .map(p => ({ product: p, days: Math.floor(Math.max(p.stock, 0) / (sold[p.id] / SPEED_DAYS)) }))
    .filter(r => r.days <= reorder.soon)
    .sort((a, b) => a.days - b.days);
}

// Products with stock that have not gone OUT lately, longest first
function notMovingList() {
  const lastOut = {};
  for (const m of movements) {
    if (m.type === "OUT") lastOut[m.productId] = m.date; // movements are oldest first
  }
  const from = dateBack(notMovingDays - 1);
  return products
    .filter(p => p.stock > 0 && !(lastOut[p.id] >= from))
    .map(p => ({ product: p, last: lastOut[p.id] || "" }))
    .sort((a, b) => a.last.localeCompare(b.last));
}

// Fill one Insights list. Each row is [left text, small text, right text, right class].
function fillList(id, rows, emptyText) {
  const list = document.getElementById(id);
  list.innerHTML = "";
  if (rows.length === 0) list.appendChild(el("li", "empty", emptyText));
  for (const [name, small, right, rightClass] of rows.slice(0, LIST_MAX_ROWS)) {
    const li = el("li");
    const left = el("div");
    left.appendChild(el("div", "", name));
    if (small) left.appendChild(el("div", "small", small));
    li.appendChild(left);
    li.appendChild(el("div", "right " + (rightClass || ""), right));
    list.appendChild(li);
  }
  if (rows.length > LIST_MAX_ROWS) list.appendChild(el("li", "empty", t("And {n} more.", { n: rows.length - LIST_MAX_ROWS })));
}

function renderInsights() {
  const productId = Number(document.getElementById("insight-product").value) || null;
  const now = periodTotals(currentRange, productId, 0);
  const before = periodTotals(currentRange, productId, 1);
  const toOrder = reorderList();
  const notMoving = notMovingList();

  // Numbers across the top
  document.getElementById("ins-profit").textContent = money(now.profit);
  document.getElementById("ins-units").textContent = money(now.units);
  document.getElementById("ins-order").textContent = toOrder.length;
  document.getElementById("ins-still").textContent = notMoving.length;
  showChange("ins-profit-change", now.profit, before.profit);
  showChange("ins-units-change", now.units, before.units);

  document.getElementById("ins-hint").textContent = now.missing
    ? (now.missing === 1 ? t("1 sale is not counted in profit because a selling price or cost is missing.") : t("{n} sales are not counted in profit because a selling price or cost is missing.", { n: now.missing }))
    : "";

  // Graph
  const s = summarize(currentRange, productId);
  document.getElementById("chart-title").textContent = t("Sales and profit: {period}", { period: t(RANGE_TITLES[currentRange]).toLowerCase() });
  drawChart(document.getElementById("insight-chart"), s.buckets.map(b => ({ key: b.key, label: b.label, in: b.sales, out: b.profit })), {
    first: t("Sales"), second: t("Profit"), firstClass: "bar-sales", secondClass: "bar-profit"
  });

  // Top selling and most profitable compare products, so they need "All products"
  document.getElementById("top-card").style.display = productId ? "none" : "block";
  document.getElementById("profit-card").style.display = productId ? "none" : "block";
  const top = Object.entries(s.perProduct).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const list = document.getElementById("top-list");
  list.innerHTML = "";
  if (top.length === 0) list.appendChild(el("li", "empty", t("No OUT movements in this period.")));
  for (const [name, value] of top) {
    const li = el("li", "top-item");
    const line = el("div", "line");
    line.appendChild(el("span", "", name));
    line.appendChild(el("b", "", money(value)));
    const bg = el("div", "bar-bg");
    const fill = el("div", "bar-fill");
    fill.style.width = (value / top[0][1] * 100) + "%";
    bg.appendChild(fill);
    li.appendChild(line);
    li.appendChild(bg);
    list.appendChild(li);
  }

  fillList("reorder-list", toOrder.map(r => [
    r.product.name,
    t("{n} {unit} left", { n: r.product.stock, unit: r.product.unit }),
    t(r.days <= reorder.now ? "Order now · {n} days" : "Order soon · {n} days", { n: r.days }),
    r.days <= reorder.now ? "minus" : "low"
  ]), t("Nothing needs ordering yet."));

  fillList("still-list", notMoving.map(r => [
    r.product.name,
    t("{n} {unit} in stock", { n: r.product.stock, unit: r.product.unit }),
    r.last ? t("Last OUT {date}", { date: new Date(r.last + "T00:00").toLocaleDateString(dateLocale(), { dateStyle: "medium" }) }) : t("Never sold"),
    "small"
  ]), t("Everything in stock has moved recently."));

  fillList("customer-list", Object.entries(s.perCustomer).sort((a, b) => b[1].sales - a[1].sales || b[1].units - a[1].units).map(([name, c]) => [
    name,
    t(c.orders === 1 ? "{units} units · 1 record" : "{units} units · {n} records", { units: money(c.units), n: c.orders }),
    money(c.sales),
    "qty"
  ]), t("No customers recorded in this period."));

  fillList("profit-list", Object.entries(s.perProfit).sort((a, b) => b[1] - a[1]).map(([name, value]) => [
    name, "", money(value), value >= 0 ? "ok qty" : "minus qty"
  ]), t("No profit worked out in this period yet."));
}

document.querySelectorAll("#range-seg button").forEach(b => {
  b.addEventListener("click", () => {
    currentRange = b.dataset.range;
    document.querySelectorAll("#range-seg button").forEach(x => x.classList.toggle("active", x === b));
    renderInsights();
  });
});
document.getElementById("insight-product").addEventListener("change", renderInsights);
document.querySelectorAll("#still-seg button").forEach(b => {
  b.addEventListener("click", () => {
    notMovingDays = Number(b.dataset.days);
    document.querySelectorAll("#still-seg button").forEach(x => x.classList.toggle("active", x === b));
    renderInsights();
  });
});

// ---------- drawing the graph (plain SVG, no extra libraries needed) ----------

function niceStep(raw) {
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / mag;
  const f = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return f * mag;
}

// Two bars for each box. "names" changes what they are called, IN and OUT unless given.
function drawChart(container, buckets, names) {
  const { first, second, firstClass, secondClass } = names || { first: t("IN"), second: t("OUT"), firstClass: "bar-in", secondClass: "bar-out" };
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
    const hIn = Math.max(b.in, 0) / top * ph;
    const hOut = Math.max(b.out, 0) / top * ph;
    s += '<rect class="' + firstClass + '" x="' + (gx - bw - 1) + '" y="' + (T + ph - hIn) + '" width="' + bw + '" height="' + hIn + '" rx="2"><title>' + b.key + " " + first + ": " + money(b.in) + "</title></rect>";
    s += '<rect class="' + secondClass + '" x="' + (gx + 1) + '" y="' + (T + ph - hOut) + '" width="' + bw + '" height="' + hOut + '" rx="2"><title>' + b.key + " " + second + ": " + money(b.out) + "</title></rect>";
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
    const td = el("td", "empty", t("Nothing recorded in this period."));
    td.colSpan = 5;
    tr.appendChild(td);
    body.appendChild(tr);
  }

  const labels = { IN: t("IN"), OUT: t("OUT"), ADJUST: t("Fix") };
  let lastDate = null;
  for (const m of rows.slice(0, historyLimit)) {
    if (m.date !== lastDate) {
      lastDate = m.date;
      const head = el("tr", "day-row");
      const td = el("td");
      td.colSpan = 5;
      const line = el("div", "line");
      line.appendChild(el("span", "", longDate(new Date(m.date + "T00:00"))));
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
    const price = m.unitPrice !== null ? m.unitPrice : m.unitCost;
    const info = [m.contact, price === null ? "" : "@ " + money(price), m.note].filter(Boolean).join(" · ");
    if (info) name.appendChild(el("div", "small", info));
    tr.appendChild(name);
    tr.appendChild(el("td", "", "")).appendChild(el("span", "badge " + m.type.toLowerCase(), labels[m.type] || m.type));
    tr.appendChild(el("td", "num " + (m.type === "ADJUST" ? "adj" : (d >= 0 ? "plus" : "minus")), (d > 0 ? "+" : "") + d));
    tr.appendChild(el("td", "num", m.stockAfter === null ? "" : String(m.stockAfter)));
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
  const rows = [["Date", "Time", "Product", "Type", "Quantity", "Change", "Stock after", "Customer or supplier", "Selling price", "Cost", "Note"]];
  for (const m of movements) rows.push([m.date, m.time, m.productName, labels[m.type] || m.type, m.qty, deltaOf(m), m.stockAfter, m.contact, m.unitPrice, m.unitCost, m.note]);
  downloadCSV("history-" + todayString() + ".csv", rows);
});

// Replace all products and history on the server, for every device
async function replaceAll(newProducts, newMovements, message) {
  movements = []; // makes loadData fetch the new history
  return saveToServer("replace_all_data", { p_products: newProducts, p_movements: newMovements }, message);
}

document.getElementById("clear-btn").addEventListener("click", () => {
  if (saving) return;
  if (!confirm(t("Delete ALL products and history for EVERYONE? This cannot be undone."))) return;
  replaceAll([], [], t("All data deleted"));
});

// The reorder warning levels on the Insights page
function showReorderSettings() {
  document.getElementById("order-now").value = reorder.now;
  document.getElementById("order-soon").value = reorder.soon;
}

document.getElementById("reorder-form").addEventListener("submit", function (event) {
  event.preventDefault();
  if (saving) return;
  saveToServer("save_settings", {
    p_order_now: Number(document.getElementById("order-now").value),
    p_order_soon: Number(document.getElementById("order-soon").value)
  }, t("Saved"));
});

// Data from before the database, still saved in this browser
function oldList(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch (e) { return []; }
}

function showImportCard() {
  const count = oldList("products").length + oldList("movements").length;
  document.getElementById("import-card").style.display = count ? "block" : "none";
}

document.getElementById("import-btn").addEventListener("click", async () => {
  if (saving) return;
  const oldProducts = oldList("products");
  const oldMovements = oldList("movements").map(m => ({ ...m, delta: deltaOf(m) }));
  const question = t("Replace everything in the database with {products} products and {records} history records from this browser? This cannot be undone.", { products: oldProducts.length, records: oldMovements.length });
  if (!confirm(question)) return;

  if (await replaceAll(oldProducts, oldMovements, t("Data moved to the database"))) {
    localStorage.removeItem("products");
    localStorage.removeItem("movements");
    showImportCard();
  }
});

document.getElementById("demo-btn").addEventListener("click", () => {
  if (saving) return;
  if (!confirm(t("This replaces everything in the database with sample data, for everyone. Continue?"))) return;

  const demo = [
    { name: "Material A", kind: "material", unit: "kg", min: 30, base: 8, cost: 40 },
    { name: "Material B", kind: "material", unit: "kg", min: 30, base: 6, cost: 55 },
    { name: "Packaging box", kind: "material", unit: "pcs", min: 100, base: 20, cost: 3 },
    { name: "Product X", kind: "product", unit: "pcs", min: 20, base: 10, cost: 60, price: 95 },
    { name: "Product Y", kind: "product", unit: "pcs", min: 20, base: 7, cost: 90, price: 150 },
    { name: "Product Z", kind: "product", unit: "pcs", min: 15, base: 4, cost: 150, price: 240 }
  ];
  const sample = demo.map((d, i) => ({ id: i + 1, name: d.name, kind: d.kind, unit: d.unit, stock: 0, min: d.min }));
  const sampleMoves = [];
  const customers = ["Lin Trading", "Golden Shop", "Mr. Chen", "Happy Market", ""];
  const suppliers = ["Bright Supply", "East Factory"];
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const vary = n => Math.round(n * (0.9 + Math.random() * 0.2)); // prices move a little each time

  const today = new Date();
  for (let back = 364; back >= 0; back--) {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - back);
    const weekend = day.getDay() === 0 || day.getDay() === 6;
    const dayMoves = [];

    sample.forEach((p, i) => {
      if (Math.random() < (weekend ? 0.4 : 0.8)) {
        const want = Math.max(1, Math.round(demo[i].base * (0.5 + Math.random())));
        const make = (type, qty) => {
          p.stock += type === "IN" ? qty : -qty;
          dayMoves.push({
            date: dateStr(day), productId: p.id, productName: p.name, type: type, qty: qty,
            delta: type === "IN" ? qty : -qty, note: "", stockAfter: p.stock,
            unitCost: type === "IN" ? vary(demo[i].cost) : null,
            unitPrice: type === "OUT" && demo[i].price ? vary(demo[i].price) : null,
            contact: type === "IN" ? pick(suppliers) : (demo[i].price ? pick(customers) : "")
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
      sampleMoves.push(m);
    });
  }

  replaceAll(sample, sampleMoves, t("Sample data loaded"));
});

// =====================================================
// 9. START
// =====================================================

document.querySelectorAll("button[data-page]").forEach(b => {
  b.addEventListener("click", () => showPage(b.dataset.page));
});

// Pick up changes made on other devices. Pages being typed in are left alone
// until the next check, so a redraw cannot interrupt the person using them.
async function checkForChanges() {
  if (!currentUser || document.hidden || saving) return;
  try { await loadData(); }
  catch (e) { return; }
  const busy = document.querySelector("dialog[open]") || ["INPUT", "SELECT"].includes(document.activeElement.tagName);
  if (!busy) render();
}

document.querySelectorAll(".lang-btn").forEach(b => {
  b.addEventListener("click", () => {
    setLanguage(language === "th" ? "en" : "th");
    if (currentUser) { showUserName(); render(); }
    else document.getElementById("login-error").textContent = "";
  });
});

translatePage();
showImportCard();

if (db) {
  setInterval(checkForChanges, CHECK_EVERY_MS);
  document.addEventListener("visibilitychange", checkForChanges);

  db.auth.onAuthStateChange(event => { if (event === "SIGNED_OUT") endSession(); });
  db.auth.getSession().then(({ data }) => { if (data.session) startSession(); });
} else {
  document.getElementById("login-error").textContent = t("This app is not connected to its database yet. See README.md.");
}
