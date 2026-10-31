// Thai and English. The English text is written directly in the app,
// and this list gives the Thai for each piece of it. Thai is the default.

const THAI = {
  // Menu and login
  "Home": "หน้าหลัก",
  "Stock": "สต็อก",
  "Record": "บันทึก",
  "History": "ประวัติ",
  "Insights": "วิเคราะห์",
  "Settings": "ตั้งค่า",
  "Please log in to continue.": "กรุณาเข้าสู่ระบบเพื่อใช้งาน",
  "Username": "ชื่อผู้ใช้",
  "Password": "รหัสผ่าน",
  "Log in": "เข้าสู่ระบบ",
  "Log out": "ออกจากระบบ",
  "Log out?": "ต้องการออกจากระบบใช่ไหม?",
  "Logged in as": "ผู้ใช้:",
  "{name} (limited)": "{name} (จำกัดสิทธิ์)",
  "Wrong username or password.": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
  "Could not reach the server. Try again.": "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่",
  "Could not reach the database. Try again in a minute.": "เชื่อมต่อฐานข้อมูลไม่ได้ กรุณาลองใหม่ในอีกสักครู่",
  "This account has no access yet. Ask the owner to set it up.": "บัญชีนี้ยังไม่มีสิทธิ์ใช้งาน กรุณาให้เจ้าของตั้งค่าให้",
  "This account is not confirmed yet. Ask the owner to confirm it in Supabase.": "บัญชีนี้ยังไม่ได้ยืนยัน กรุณาให้เจ้าของยืนยันใน Supabase",
  "This app is not connected to its database yet. See README.md.": "แอปยังไม่ได้เชื่อมต่อฐานข้อมูล ดูวิธีใน README.md",

  // Home
  "Manage your inventory with ease": "จัดการสต็อกสินค้าได้ง่าย ๆ",
  "Products": "สินค้า",
  "Low stock": "สินค้าใกล้หมด",
  "Out of stock": "สินค้าหมด",
  "Today": "วันนี้",
  "Stock IN": "รับเข้า",
  "Stock OUT": "จ่ายออก",
  "Last 7 days": "7 วันล่าสุด",
  "Needs attention": "ต้องดูแล",
  "Recent activity": "รายการล่าสุด",
  "All products have enough stock.": "สินค้าทุกรายการมีสต็อกเพียงพอ",
  "No products yet. Go to Stock and add one.": "ยังไม่มีสินค้า ไปที่หน้าสต็อกเพื่อเพิ่มสินค้า",
  "Low: {n} {unit}": "ใกล้หมด: {n} {unit}",
  "Nothing recorded yet.": "ยังไม่มีรายการ",
  "IN": "รับเข้า",
  "OUT": "จ่ายออก",

  // Stock
  "+ Add product": "+ เพิ่มสินค้า",
  "Search products": "ค้นหาสินค้า",
  "Tap a product to edit, correct its stock, or delete it.": "แตะสินค้าเพื่อแก้ไข ปรับสต็อก หรือลบ",
  "No product matches your search.": "ไม่พบสินค้าที่ค้นหา",
  "No products yet. Tap + Add product.": "ยังไม่มีสินค้า แตะ + เพิ่มสินค้า",
  "Material": "วัตถุดิบ",
  "Finished product": "สินค้าสำเร็จรูป",
  "{kind} · warn below {min}": "{kind} · เตือนเมื่อต่ำกว่า {min}",
  "Add product": "เพิ่มสินค้า",
  "Edit product": "แก้ไขสินค้า",
  "Name": "ชื่อ",
  "Kind": "ประเภท",
  "Material (we buy it)": "วัตถุดิบ (ซื้อเข้ามา)",
  "Finished product (we make or sell it)": "สินค้าสำเร็จรูป (ผลิตหรือขาย)",
  "Unit (pcs, kg, box...)": "หน่วย (ชิ้น, กก., กล่อง...)",
  "Starting stock": "สต็อกเริ่มต้น",
  "Stock now (change it only to fix a mistake)": "สต็อกปัจจุบัน (แก้เมื่อตัวเลขผิดเท่านั้น)",
  "Warn me when stock is below": "เตือนเมื่อสต็อกต่ำกว่า",
  "Delete": "ลบ",
  "Cancel": "ยกเลิก",
  "Save": "บันทึก",
  "Saved": "บันทึกแล้ว",
  "Deleted": "ลบแล้ว",
  "Delete \"{name}\" for everyone? Its past history stays in the records.": "ลบ \"{name}\" สำหรับทุกคนใช่ไหม? ประวัติเดิมจะยังอยู่",

  // Record
  "Record stock IN / OUT": "บันทึกรับเข้า / จ่ายออก",
  "IN (received / made)": "รับเข้า (รับของ / ผลิต)",
  "OUT (sold / used)": "จ่ายออก (ขาย / ใช้)",
  "+ Add another product": "+ เพิ่มสินค้าอีกรายการ",
  "Note (optional)": "หมายเหตุ (ไม่บังคับ)",
  "Customer (optional)": "ลูกค้า (ไม่บังคับ)",
  "Supplier (optional)": "ผู้ขาย (ไม่บังคับ)",
  "Customer": "ลูกค้า",
  "Supplier": "ผู้ขาย",
  "Type or choose a product": "พิมพ์หรือเลือกสินค้า",
  "Type or choose a name": "พิมพ์หรือเลือกชื่อ",
  "No products yet (add one in Stock)": "ยังไม่มีสินค้า (เพิ่มได้ที่หน้าสต็อก)",
  "No product matches.": "ไม่พบสินค้า",
  "Keep typing to see more.": "พิมพ์เพิ่มเพื่อดูรายการอื่น",
  "Choose a product from the list": "กรุณาเลือกสินค้าจากรายการ",
  "{n} {unit} left": "เหลือ {n} {unit}",
  "Qty": "จำนวน",
  "Quantity": "จำนวน",
  "Price each": "ราคาต่อหน่วย",
  "Cost each": "ต้นทุนต่อหน่วย",
  "Remove this product": "เอาสินค้านี้ออก",
  "A product was deleted on another device. Please check the list.": "มีสินค้าถูกลบจากอุปกรณ์อื่น กรุณาตรวจสอบรายการ",
  "Not enough {name}. Only {n} {unit} left.": "{name} ไม่พอ เหลือเพียง {n} {unit}",
  "Stock {before} → {after} {unit}": "สต็อก {before} → {after} {unit}",
  "Confirm stock {type}": "ยืนยัน{type}",
  "Back": "กลับ",
  "Confirm": "ยืนยัน",
  "Total: {n}": "รวม: {n}",
  "Customer: {name}": "ลูกค้า: {name}",
  "Supplier: {name}": "ผู้ขาย: {name}",
  "Note: {text}": "หมายเหตุ: {text}",
  "Saved 1 product": "บันทึกแล้ว 1 รายการ",
  "Saved {n} products": "บันทึกแล้ว {n} รายการ",
  "Not saved. {reason}": "บันทึกไม่สำเร็จ {reason}",
  "Could not refresh the data": "รีเฟรชข้อมูลไม่สำเร็จ",

  // History
  "Day": "วัน",
  "Week": "สัปดาห์",
  "Month": "เดือน",
  "Year": "ปี",
  "All": "ทั้งหมด",
  "All products": "สินค้าทั้งหมด",
  "Total IN": "รับเข้ารวม",
  "Total OUT": "จ่ายออกรวม",
  "Records": "จำนวนรายการ",
  "Log": "รายการ",
  "Time": "เวลา",
  "Product": "สินค้า",
  "Type": "ประเภท",
  "Left": "คงเหลือ",
  "Show more": "ดูเพิ่มเติม",
  "Fix": "ปรับสต็อก",
  "Nothing recorded in this period.": "ไม่มีรายการในช่วงนี้",

  // Insights
  "Today, hour by hour": "วันนี้ รายชั่วโมง",
  "Last 30 days": "30 วันล่าสุด",
  "Last 12 months": "12 เดือนล่าสุด",
  "Sales and profit: {period}": "ยอดขายและกำไร: {period}",
  "Sales": "ยอดขาย",
  "Profit": "กำไร",
  "Units OUT": "จำนวนจ่ายออก",
  "To order": "ต้องสั่งซื้อ",
  "Not moving": "สินค้าไม่เคลื่อนไหว",
  "Top selling / used": "ขายดี / ใช้มากที่สุด",
  "Reorder soon": "ควรสั่งซื้อ",
  "Top customers": "ลูกค้าอันดับต้น",
  "Most profitable": "กำไรสูงสุด",
  "30 days": "30 วัน",
  "60 days": "60 วัน",
  "90 days": "90 วัน",
  "{percent}% from {period}": "{percent}% จาก {period}",
  "yesterday": "เมื่อวาน",
  "the 7 days before": "7 วันก่อนหน้า",
  "the 30 days before": "30 วันก่อนหน้า",
  "the year before": "ปีก่อนหน้า",
  "1 sale is not counted in profit because a selling price or cost is missing.": "มี 1 รายการขายที่ไม่ได้นับในกำไร เพราะไม่มีราคาขายหรือต้นทุน",
  "{n} sales are not counted in profit because a selling price or cost is missing.": "มี {n} รายการขายที่ไม่ได้นับในกำไร เพราะไม่มีราคาขายหรือต้นทุน",
  "No OUT movements in this period.": "ไม่มีรายการจ่ายออกในช่วงนี้",
  "Order now · {n} days": "สั่งซื้อเลย · {n} วัน",
  "Order soon · {n} days": "ควรสั่งเร็ว ๆ นี้ · {n} วัน",
  "Nothing needs ordering yet.": "ยังไม่มีสินค้าที่ต้องสั่งซื้อ",
  "{n} {unit} in stock": "มีในสต็อก {n} {unit}",
  "Last OUT {date}": "จ่ายออกล่าสุด {date}",
  "Never sold": "ยังไม่เคยขาย",
  "Everything in stock has moved recently.": "สินค้าในสต็อกมีการเคลื่อนไหวทั้งหมด",
  "{units} units · 1 record": "{units} หน่วย · 1 รายการ",
  "{units} units · {n} records": "{units} หน่วย · {n} รายการ",
  "No customers recorded in this period.": "ไม่มีข้อมูลลูกค้าในช่วงนี้",
  "No profit worked out in this period yet.": "ยังไม่มีข้อมูลกำไรในช่วงนี้",
  "And {n} more.": "และอีก {n} รายการ",

  // Settings
  "Save to Excel": "บันทึกเป็น Excel",
  "Downloads a .csv file. Excel opens it directly.": "ดาวน์โหลดไฟล์ .csv ซึ่งเปิดใน Excel ได้ทันที",
  "Download stock list": "ดาวน์โหลดรายการสต็อก",
  "Download full history": "ดาวน์โหลดประวัติทั้งหมด",
  "Reorder warnings": "การเตือนสั่งซื้อ",
  "Based on how fast each product sold in the last 30 days. Set these to your slowest delivery time.": "คำนวณจากความเร็วการขายใน 30 วันล่าสุด ควรตั้งตามเวลาจัดส่งที่นานที่สุด",
  "Order now when stock left is this many days or less": "สั่งซื้อเลย เมื่อสต็อกเหลือไม่เกินกี่วัน",
  "Order soon when stock left is this many days or less": "ควรสั่งเร็ว ๆ นี้ เมื่อสต็อกเหลือไม่เกินกี่วัน",
  "Save warnings": "บันทึกการเตือน",
  "Try it with sample data": "ทดลองด้วยข้อมูลตัวอย่าง",
  "Fills the app with one year of sample movements so you can see the graphs. This replaces everything in the database, for everyone.": "เติมข้อมูลตัวอย่าง 1 ปีเพื่อดูกราฟ ข้อมูลทั้งหมดในฐานข้อมูลจะถูกแทนที่สำหรับทุกคน",
  "Load sample data": "โหลดข้อมูลตัวอย่าง",
  "Sample data loaded": "โหลดข้อมูลตัวอย่างแล้ว",
  "This replaces everything in the database with sample data, for everyone. Continue?": "ข้อมูลทั้งหมดในฐานข้อมูลจะถูกแทนที่ด้วยข้อมูลตัวอย่างสำหรับทุกคน ต้องการดำเนินการต่อไหม?",
  "Move data from this browser": "ย้ายข้อมูลจากเบราว์เซอร์นี้",
  "This browser still has data from before the database. Moving it replaces everything in the database, for everyone.": "เบราว์เซอร์นี้ยังมีข้อมูลเก่าอยู่ การย้ายจะแทนที่ข้อมูลทั้งหมดในฐานข้อมูลสำหรับทุกคน",
  "Move data to the database": "ย้ายข้อมูลไปยังฐานข้อมูล",
  "Data moved to the database": "ย้ายข้อมูลแล้ว",
  "Replace everything in the database with {products} products and {records} history records from this browser? This cannot be undone.": "แทนที่ข้อมูลทั้งหมดในฐานข้อมูลด้วยสินค้า {products} รายการ และประวัติ {records} รายการจากเบราว์เซอร์นี้ใช่ไหม? ย้อนกลับไม่ได้",
  "Clear everything": "ล้างข้อมูลทั้งหมด",
  "Deletes all products and history for everyone. Use this before entering real data if you tried the sample data.": "ลบสินค้าและประวัติทั้งหมดสำหรับทุกคน ใช้ก่อนเริ่มกรอกข้อมูลจริง หากเคยลองข้อมูลตัวอย่าง",
  "Delete all data": "ลบข้อมูลทั้งหมด",
  "All data deleted": "ลบข้อมูลทั้งหมดแล้ว",
  "Delete ALL products and history for EVERYONE? This cannot be undone.": "ลบสินค้าและประวัติทั้งหมดสำหรับทุกคนใช่ไหม? ย้อนกลับไม่ได้",

  // Messages from the database
  "Your account is not allowed to do this.": "บัญชีของคุณไม่มีสิทธิ์ทำรายการนี้",
  "Add at least one product.": "กรุณาเพิ่มสินค้าอย่างน้อย 1 รายการ",
  "Quantity must be more than zero.": "จำนวนต้องมากกว่าศูนย์",
  "Price cannot be below zero.": "ราคาต้องไม่ติดลบ",
  "A product in this record was deleted. Please check and try again.": "มีสินค้าในรายการนี้ถูกลบแล้ว กรุณาตรวจสอบแล้วลองใหม่",
  "This product was deleted on another device.": "สินค้านี้ถูกลบจากอุปกรณ์อื่นแล้ว",
  "Order soon must be the same as or more than Order now.": "ค่าควรสั่งเร็ว ๆ นี้ต้องไม่น้อยกว่าค่าสั่งซื้อเลย"
};

let language = "th";
try { language = localStorage.getItem("language") || "th"; } catch (e) {}

// The text in the chosen language, with {name} parts filled in
function t(text, values) {
  let result = language === "th" && THAI[text] !== undefined ? THAI[text] : text;
  for (const key in values) result = result.split("{" + key + "}").join(values[key]);
  return result;
}

// A message written by the database
function serverText(message) {
  const short = message.match(/^Not enough (.+)\. Only (\S+) (.+) left\.$/);
  if (short) return t("Not enough {name}. Only {n} {unit} left.", { name: short[1], n: short[2], unit: short[3] });
  return t(message);
}

function dateLocale() { return language === "th" ? "th-TH" : "en-US"; }

// The fixed text in index.html. The English is kept so the language can change back.
const originalText = new Map();

function translatePage() {
  document.documentElement.lang = language;
  document.querySelectorAll(".lang-btn").forEach(b => { b.textContent = language === "th" ? "English" : "ไทย"; });

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const english = originalText.get(node) || node.nodeValue;
    const trimmed = english.trim();
    if (THAI[trimmed] === undefined) continue;
    originalText.set(node, english);
    node.nodeValue = english.replace(trimmed, t(trimmed));
  }

  for (const box of document.querySelectorAll("[placeholder]")) {
    if (!box.dataset.english) box.dataset.english = box.placeholder;
    box.placeholder = t(box.dataset.english);
  }
}

function setLanguage(next) {
  language = next;
  try { localStorage.setItem("language", next); } catch (e) {}
  translatePage();
}
