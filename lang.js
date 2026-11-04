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
  "Tap a record to undo it.": "แตะรายการที่บันทึกผิดเพื่อยกเลิก",
  "Undo": "ยกเลิก",
  "Undone": "ยกเลิกแล้ว",
  "by {name}": "โดย {name}",
  "Manual correction": "แก้ไขด้วยมือ",
  "Last price": "ราคาล่าสุด",
  "Recipe": "สูตรผลิต",
  "Make": "ผลิต",
  "Made": "ผลิต",
  "Used": "ใช้ผลิต",
  "Choose a material": "เลือกวัตถุดิบ",
  "+ Add material": "+ เพิ่มวัตถุดิบ",
  "Quantity made": "จำนวนที่ผลิต",
  "What goes into 1 {unit} of {name}": "สิ่งที่ใช้ทำ {name} 1 {unit}",
  "Uses {n} of {left} {unit}": "ใช้ {n} จาก {left} {unit}",
  "Cost per {unit}: {n}": "ต้นทุนต่อ{unit}: {n}",
  "Cost not known yet: a material has no cost.": "ยังคำนวณต้นทุนไม่ได้ เพราะมีวัตถุดิบที่ยังไม่มีต้นทุน",
  "Production saved": "บันทึกการผลิตแล้ว",
  "This product has no recipe yet.": "สินค้านี้ยังไม่มีสูตรผลิต",
  "A product cannot be a material in its own recipe.": "ใช้สินค้าเป็นวัตถุดิบของตัวเองไม่ได้",
  "Undo this whole production? The product and all its materials go back to how they were.": "ยกเลิกการผลิตครั้งนี้ทั้งหมดใช่ไหม? สินค้าและวัตถุดิบทั้งหมดจะกลับเป็นเหมือนเดิม",
  "Waiting for stock": "รอของ",
  "Waiting for {n} {unit}": "รอของ {n} {unit}",
  "Ordered": "สั่งแล้ว",
  "Record an order": "บันทึกว่าสั่งของแล้ว",
  "Stock arrived": "รับของแล้ว",
  "Cancel order": "ยกเลิกการสั่ง",
  "Cancel the order of {name}?": "ยกเลิกการสั่ง {name} ใช่ไหม?",
  "Order cancelled": "ยกเลิกการสั่งแล้ว",
  "Order saved": "บันทึกการสั่งแล้ว",
  "Stock added": "เพิ่มสต็อกแล้ว",
  "Cost per unit (optional)": "ต้นทุนต่อหน่วย (ไม่บังคับ)",
  "This order was already closed on another device.": "รายการสั่งนี้ถูกปิดจากอีกเครื่องแล้ว",
  "Stock count": "นับสต็อก",
  "Count stock": "นับสต็อก",
  "Check and save": "ตรวจและบันทึก",
  "Type the number you counted on the shelf. Products you leave empty do not change.": "กรอกจำนวนที่นับได้จริง สินค้าที่เว้นว่างไว้จะไม่เปลี่ยน",
  "In the app: {n} {unit}": "ในแอป {n} {unit}",
  "Matches": "ตรงกัน",
  "Difference {n}": "ต่างกัน {n}",
  "Counted {done} of {total}": "นับแล้ว {done} จาก {total} รายการ",
  "Type at least one counted number.": "กรุณากรอกจำนวนที่นับได้อย่างน้อย 1 รายการ",
  "The counted number cannot be below zero.": "จำนวนที่นับได้ต้องไม่ติดลบ",
  "Everything matches. Nothing to change.": "ตรงกันทุกรายการ ไม่ต้องแก้ไข",
  "Confirm stock count": "ยืนยันการนับสต็อก",
  "{n} more counted products match.": "สินค้าที่นับแล้วอีก {n} รายการตรงกัน",
  "Record undone": "ยกเลิกรายการแล้ว",
  "Undid the record from {date} {time}": "ยกเลิกรายการของ {date} {time}",
  "Undo this record of {name}? Stock changes from {before} to {after} {unit}.": "ยกเลิกรายการ {name} ใช่ไหม? สต็อกจะเปลี่ยนจาก {before} เป็น {after} {unit}",

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
  "Backup": "สำรองข้อมูล",
  "Time to back up": "ถึงเวลาสำรองข้อมูล",
  "Back up now": "สำรองข้อมูลตอนนี้",
  "Download backup": "ดาวน์โหลดไฟล์สำรองข้อมูล",
  "Restore from a backup": "กู้คืนจากไฟล์สำรอง",
  "Saves products, history, customers, suppliers and reorder warnings in one file. Keep it somewhere safe and private. Logins are not included.": "เก็บสินค้า ประวัติ ลูกค้า ผู้ขาย และการเตือนสั่งซื้อไว้ในไฟล์เดียว ควรเก็บไฟล์ไว้ในที่ปลอดภัยและเป็นส่วนตัว ไฟล์นี้ไม่รวมบัญชีผู้ใช้",
  "You have not made a backup yet.": "ยังไม่เคยสำรองข้อมูล",
  "Last backup: {date}": "สำรองข้อมูลล่าสุด: {date}",
  "Your last backup was {n} days ago.": "สำรองข้อมูลล่าสุดเมื่อ {n} วันก่อน",
  "Backup downloaded": "ดาวน์โหลดไฟล์สำรองแล้ว",
  "Backup restored": "กู้คืนข้อมูลแล้ว",
  "Could not make the backup. Try again.": "สร้างไฟล์สำรองไม่สำเร็จ กรุณาลองใหม่",
  "This is not a TC Inventory backup file.": "ไฟล์นี้ไม่ใช่ไฟล์สำรองของ TC Inventory",
  "Replace everything, for everyone, with the backup from {date}? It has {products} products and {records} history records. The current data is downloaded first.": "แทนที่ข้อมูลทั้งหมดของทุกคนด้วยไฟล์สำรองวันที่ {date} ใช่ไหม? มีสินค้า {products} รายการ และประวัติ {records} รายการ แอปจะดาวน์โหลดข้อมูลปัจจุบันเก็บไว้ก่อน",
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
  "This record was not found.": "ไม่พบรายการนี้",
  "This record cannot be undone.": "ยกเลิกรายการนี้ไม่ได้",
  "This record was already undone.": "รายการนี้ถูกยกเลิกไปแล้ว",
  "Order soon must be the same as or more than Order now.": "ค่าควรสั่งเร็ว ๆ นี้ต้องไม่น้อยกว่าค่าสั่งซื้อเลย",
  "This order was not found.": "ไม่พบคำสั่งซื้อนี้",
  "This order was already packed or cancelled.": "คำสั่งซื้อนี้ถูกจัดหรือยกเลิกไปแล้ว",
  "This order has no products to pack.": "คำสั่งซื้อนี้ไม่มีสินค้าให้จัด",
  "Pack this order before marking it as sent.": "กรุณากดจัดแล้วก่อน แล้วค่อยกดส่งแล้ว",
  "This order can no longer be cancelled.": "คำสั่งซื้อนี้ยกเลิกไม่ได้แล้ว",
  "No product has the code {code}. Add the code to the product in Stock first.": "ไม่มีสินค้าที่ใช้รหัส {code} กรุณาใส่รหัสนี้ให้สินค้าในหน้าสต็อกก่อน",
  "Another product already has the code {code}.": "รหัส {code} ถูกใช้กับสินค้าอื่นแล้ว",

  // Website orders
  "Website orders": "คำสั่งซื้อจากเว็บไซต์",
  "{n} new": "ใหม่ {n}",
  "No website orders waiting.": "ยังไม่มีคำสั่งซื้อจากเว็บไซต์ที่รอจัดการ",
  "{n} items": "{n} รายการ",
  "Message only": "ข้อความอย่างเดียว",
  "New": "ใหม่",
  "Read": "อ่านแล้ว",
  "Packed": "จัดแล้ว",
  "Sent": "ส่งแล้ว",
  "Order #{n}": "คำสั่งซื้อ #{n}",
  "No product has this code": "ไม่มีสินค้าที่ใช้รหัสนี้",
  "Stock now: {n} {unit}": "มีอยู่ {n} {unit}",
  "Price (optional)": "ราคา (ถ้ามี)",
  "Price per {unit} for {name}": "ราคาต่อ{unit} ของ {name}",
  "This order is only a message. Reply to the customer, then cancel it here when done.": "คำสั่งซื้อนี้เป็นข้อความอย่างเดียว ตอบลูกค้าแล้ว กดยกเลิกที่นี่เมื่อเสร็จ",
  "Add the website code to these products in Stock before packing.": "ใส่รหัสเว็บไซต์ให้สินค้าเหล่านี้ในหน้าสต็อกก่อน แล้วค่อยจัด",
  "Packed takes these products out of stock.": "กดจัดแล้ว สต็อกของสินค้าเหล่านี้จะลดลง",
  "Sent means the customer has the products.": "กดส่งแล้ว เมื่อลูกค้าได้รับสินค้าแล้ว",
  "Mark order #{n} as sent?": "ยืนยันว่าส่งคำสั่งซื้อ #{n} แล้วใช่ไหม?",
  "Take the products in order #{n} out of stock?": "ตัดสต็อกสินค้าในคำสั่งซื้อ #{n} ใช่ไหม?",
  "Cancel order #{n}? Its products go back into stock.": "ยกเลิกคำสั่งซื้อ #{n} ใช่ไหม? สินค้าจะถูกคืนเข้าสต็อก",
  "Cancel order #{n}?": "ยกเลิกคำสั่งซื้อ #{n} ใช่ไหม?",
  "Order marked as sent": "บันทึกว่าส่งแล้ว",
  "Order packed. Stock updated.": "จัดแล้ว ตัดสต็อกเรียบร้อย",
  "New order from the website": "มีคำสั่งซื้อใหม่จากเว็บไซต์",
  "Website code (optional)": "รหัสเว็บไซต์ (ถ้ามี)"
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
  const noCode = message.match(/^No product has the code (.+)\. Add the code to the product in Stock first\.$/);
  if (noCode) return t("No product has the code {code}. Add the code to the product in Stock first.", { code: noCode[1] });
  const takenCode = message.match(/^Another product already has the code (.+)\.$/);
  if (takenCode) return t("Another product already has the code {code}.", { code: takenCode[1] });
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
