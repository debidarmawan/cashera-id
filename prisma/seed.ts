import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	console.log('🌱 Seeding database...')

	// Clear existing data
	console.log('🧹 Clearing existing data...')
	await prisma.saleItem.deleteMany()
	await prisma.sale.deleteMany()
	await prisma.product.deleteMany()
	await prisma.customer.deleteMany()
	await prisma.pOSSettings.deleteMany()

	// Create POS Settings
	const settings = await prisma.pOSSettings.create({
		data: {
			store_name: 'Cashera POS Store',
			store_address: '123 Business Street, City, State 12345',
			store_phone: '+1 (555) 123-4567',
			store_email: 'info@cashera.com',
			tax_rate: 0.1,
			currency: 'IDR',
			receipt_header: 'Thank you for your business!',
			receipt_footer: 'Visit us again soon!',
			low_stock_threshold: 10,
			auto_print_receipt: false,
		},
	})

	// Create 100 diverse products
	const productData = [
		// Electronics (15 products)
		{ name: 'Laptop Computer', description: 'High-performance laptop for business use', price: 19500000, cost: 12000000, sku: 'LAPTOP-001', barcode: '1234567890123', category: 'Electronics', stock: 25, min_stock: 5, max_stock: 50 },
		{ name: 'Gaming Laptop', description: 'High-end gaming laptop with RTX graphics', price: 37500000, cost: 27000000, sku: 'GAMING-001', barcode: '1234567890124', category: 'Electronics', stock: 12, min_stock: 3, max_stock: 25 },
		{ name: 'Desktop Computer', description: 'Powerful desktop workstation', price: 28500000, cost: 18000000, sku: 'DESKTOP-001', barcode: '1234567890125', category: 'Electronics', stock: 18, min_stock: 4, max_stock: 35 },
		{ name: 'Tablet 10-inch', description: '10-inch Android tablet with 128GB storage', price: 4500000, cost: 2700000, sku: 'TABLET-001', barcode: '1234567890126', category: 'Electronics', stock: 45, min_stock: 10, max_stock: 80 },
		{ name: 'Smartphone', description: 'Latest Android smartphone with 256GB', price: 12000000, cost: 7500000, sku: 'PHONE-001', barcode: '1234567890127', category: 'Electronics', stock: 30, min_stock: 8, max_stock: 60 },
		{ name: 'Smart Watch', description: 'Fitness tracking smartwatch with GPS', price: 3000000, cost: 1800000, sku: 'WATCH-001', barcode: '1234567890128', category: 'Electronics', stock: 60, min_stock: 15, max_stock: 100 },
		{ name: 'Bluetooth Headphones', description: 'Wireless noise-cancelling headphones', price: 2250000, cost: 1200000, sku: 'HEADPHONE-001', barcode: '1234567890129', category: 'Electronics', stock: 40, min_stock: 10, max_stock: 75 },
		{ name: 'Wireless Earbuds', description: 'True wireless earbuds with charging case', price: 1350000, cost: 675000, sku: 'EARBUDS-001', barcode: '1234567890130', category: 'Electronics', stock: 80, min_stock: 20, max_stock: 150 },
		{ name: 'Monitor 24-inch', description: '24-inch Full HD LED monitor', price: 2700000, cost: 1500000, sku: 'MONITOR-001', barcode: '1234567890131', category: 'Electronics', stock: 35, min_stock: 8, max_stock: 70 },
		{ name: 'Monitor 27-inch', description: '27-inch 4K Ultra HD monitor', price: 6000000, cost: 3750000, sku: 'MONITOR-002', barcode: '1234567890132', category: 'Electronics', stock: 20, min_stock: 5, max_stock: 40 },
		{ name: 'Mechanical Keyboard', description: 'RGB mechanical gaming keyboard', price: 1950000, cost: 1050000, sku: 'KEYBOARD-001', barcode: '1234567890133', category: 'Electronics', stock: 50, min_stock: 12, max_stock: 90 },
		{ name: 'Gaming Mouse', description: 'High-precision gaming mouse with RGB', price: 1200000, cost: 600000, sku: 'MOUSE-001', barcode: '1234567890134', category: 'Electronics', stock: 65, min_stock: 15, max_stock: 120 },
		{ name: 'Webcam HD', description: '1080p HD webcam with microphone', price: 1050000, cost: 525000, sku: 'WEBCAM-001', barcode: '1234567890135', category: 'Electronics', stock: 55, min_stock: 12, max_stock: 100 },
		{ name: 'External Hard Drive', description: '2TB USB 3.0 external hard drive', price: 1350000, cost: 750000, sku: 'HDD-001', barcode: '1234567890136', category: 'Electronics', stock: 40, min_stock: 10, max_stock: 80 },
		{ name: 'USB Flash Drive', description: '64GB USB 3.0 flash drive', price: 300000, cost: 150000, sku: 'USB-001', barcode: '1234567890137', category: 'Electronics', stock: 100, min_stock: 25, max_stock: 200 },

		// Accessories (15 products)
		{ name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with USB receiver', price: 450000, cost: 225000, sku: 'MOUSE-002', barcode: '1234567890138', category: 'Accessories', stock: 100, min_stock: 20, max_stock: 200 },
		{ name: 'USB-C Cable', description: 'High-speed USB-C to USB-C cable, 6ft', price: 300000, cost: 120000, sku: 'CABLE-001', barcode: '1234567890139', category: 'Accessories', stock: 75, min_stock: 15, max_stock: 150 },
		{ name: 'Lightning Cable', description: 'Apple Lightning to USB cable, 6ft', price: 375000, cost: 180000, sku: 'CABLE-002', barcode: '1234567890140', category: 'Accessories', stock: 60, min_stock: 15, max_stock: 120 },
		{ name: 'HDMI Cable', description: 'High-speed HDMI cable, 10ft', price: 240000, cost: 105000, sku: 'CABLE-003', barcode: '1234567890141', category: 'Accessories', stock: 80, min_stock: 20, max_stock: 160 },
		{ name: 'Laptop Stand', description: 'Adjustable aluminum laptop stand', price: 600000, cost: 300000, sku: 'STAND-001', barcode: '1234567890142', category: 'Accessories', stock: 45, min_stock: 10, max_stock: 90 },
		{ name: 'Laptop Bag', description: 'Waterproof laptop backpack', price: 900000, cost: 450000, sku: 'BAG-001', barcode: '1234567890143', category: 'Accessories', stock: 35, min_stock: 8, max_stock: 70 },
		{ name: 'Phone Case', description: 'Protective silicone phone case', price: 225000, cost: 90000, sku: 'CASE-001', barcode: '1234567890144', category: 'Accessories', stock: 120, min_stock: 30, max_stock: 250 },
		{ name: 'Screen Protector', description: 'Tempered glass screen protector', price: 150000, cost: 60000, sku: 'PROTECTOR-001', barcode: '1234567890145', category: 'Accessories', stock: 150, min_stock: 40, max_stock: 300 },
		{ name: 'Power Bank', description: '20000mAh portable power bank', price: 750000, cost: 375000, sku: 'POWER-001', barcode: '1234567890146', category: 'Accessories', stock: 50, min_stock: 12, max_stock: 100 },
		{ name: 'Car Charger', description: 'Dual USB car charger adapter', price: 195000, cost: 90000, sku: 'CHARGER-001', barcode: '1234567890147', category: 'Accessories', stock: 70, min_stock: 18, max_stock: 140 },
		{ name: 'Wireless Charger', description: 'Qi-compatible wireless charging pad', price: 525000, cost: 270000, sku: 'WIRELESS-001', barcode: '1234567890148', category: 'Accessories', stock: 40, min_stock: 10, max_stock: 80 },
		{ name: 'Bluetooth Speaker', description: 'Portable Bluetooth speaker with bass', price: 1200000, cost: 600000, sku: 'SPEAKER-001', barcode: '1234567890149', category: 'Accessories', stock: 30, min_stock: 8, max_stock: 60 },
		{ name: 'Desk Lamp', description: 'LED desk lamp with USB charging port', price: 690000, cost: 345000, sku: 'LAMP-001', barcode: '1234567890150', category: 'Accessories', stock: 25, min_stock: 6, max_stock: 50 },
		{ name: 'Mouse Pad', description: 'Gaming mouse pad with RGB lighting', price: 375000, cost: 180000, sku: 'PAD-001', barcode: '1234567890151', category: 'Accessories', stock: 60, min_stock: 15, max_stock: 120 },
		{ name: 'Cable Organizer', description: 'Cable management organizer box', price: 255000, cost: 120000, sku: 'ORGANIZER-001', barcode: '1234567890152', category: 'Accessories', stock: 40, min_stock: 10, max_stock: 80 },

		// Office Supplies (15 products)
		{ name: 'Ballpoint Pen Set', description: 'Set of 12 blue ballpoint pens', price: 135000, cost: 60000, sku: 'PEN-001', barcode: '1234567890153', category: 'Office Supplies', stock: 200, min_stock: 50, max_stock: 400 },
		{ name: 'Notebook A4', description: 'Spiral-bound A4 notebook, 200 pages', price: 195000, cost: 90000, sku: 'NOTEBOOK-001', barcode: '1234567890154', category: 'Office Supplies', stock: 150, min_stock: 30, max_stock: 300 },
		{ name: 'Sticky Notes', description: 'Pack of 5 sticky note pads', price: 105000, cost: 45000, sku: 'STICKY-001', barcode: '1234567890155', category: 'Office Supplies', stock: 180, min_stock: 40, max_stock: 360 },
		{ name: 'Paper Clips', description: 'Box of 1000 assorted paper clips', price: 75000, cost: 30000, sku: 'CLIPS-001', barcode: '1234567890156', category: 'Office Supplies', stock: 120, min_stock: 30, max_stock: 240 },
		{ name: 'Binder Clips', description: 'Set of 20 assorted binder clips', price: 120000, cost: 52500, sku: 'BINDER-001', barcode: '1234567890157', category: 'Office Supplies', stock: 90, min_stock: 20, max_stock: 180 },
		{ name: 'File Folders', description: 'Pack of 50 manila file folders', price: 240000, cost: 120000, sku: 'FOLDER-001', barcode: '1234567890158', category: 'Office Supplies', stock: 80, min_stock: 20, max_stock: 160 },
		{ name: 'Highlighters', description: 'Set of 6 assorted color highlighters', price: 150000, cost: 67500, sku: 'HIGHLIGHTER-001', barcode: '1234567890159', category: 'Office Supplies', stock: 100, min_stock: 25, max_stock: 200 },
		{ name: 'Whiteboard Marker', description: 'Set of 4 dry-erase markers', price: 180000, cost: 82500, sku: 'MARKER-001', barcode: '1234567890160', category: 'Office Supplies', stock: 70, min_stock: 15, max_stock: 140 },
		{ name: 'Calculator', description: 'Basic desktop calculator', price: 300000, cost: 150000, sku: 'CALC-001', barcode: '1234567890161', category: 'Office Supplies', stock: 60, min_stock: 15, max_stock: 120 },
		{ name: 'Stapler', description: 'Heavy-duty office stapler', price: 375000, cost: 180000, sku: 'STAPLER-001', barcode: '1234567890162', category: 'Office Supplies', stock: 40, min_stock: 10, max_stock: 80 },
		{ name: 'Staple Remover', description: 'Metal staple remover tool', price: 60000, cost: 22500, sku: 'REMOVER-001', barcode: '1234567890163', category: 'Office Supplies', stock: 80, min_stock: 20, max_stock: 160 },
		{ name: 'Ruler 12-inch', description: 'Transparent 12-inch ruler', price: 45000, cost: 15000, sku: 'RULER-001', barcode: '1234567890164', category: 'Office Supplies', stock: 150, min_stock: 40, max_stock: 300 },
		{ name: 'Scissors', description: 'Sharp office scissors', price: 135000, cost: 60000, sku: 'SCISSORS-001', barcode: '1234567890165', category: 'Office Supplies', stock: 50, min_stock: 12, max_stock: 100 },
		{ name: 'Tape Dispenser', description: 'Desktop tape dispenser with cutter', price: 225000, cost: 105000, sku: 'TAPE-001', barcode: '1234567890166', category: 'Office Supplies', stock: 35, min_stock: 8, max_stock: 70 },
		{ name: 'Rubber Bands', description: 'Assorted size rubber bands, 1 lb', price: 90000, cost: 37500, sku: 'BANDS-001', barcode: '1234567890167', category: 'Office Supplies', stock: 100, min_stock: 25, max_stock: 200 },

		// Home & Kitchen (15 products)
		{ name: 'Coffee Mug', description: 'Ceramic coffee mug with company logo', price: 195000, cost: 75000, sku: 'MUG-001', barcode: '1234567890168', category: 'Home & Kitchen', stock: 8, min_stock: 10, max_stock: 50 },
		{ name: 'Water Bottle', description: 'Insulated stainless steel water bottle', price: 375000, cost: 180000, sku: 'BOTTLE-001', barcode: '1234567890169', category: 'Home & Kitchen', stock: 45, min_stock: 10, max_stock: 90 },
		{ name: 'Coffee Maker', description: '12-cup programmable coffee maker', price: 1350000, cost: 675000, sku: 'COFFEE-001', barcode: '1234567890170', category: 'Home & Kitchen', stock: 20, min_stock: 5, max_stock: 40 },
		{ name: 'Toaster', description: '2-slice stainless steel toaster', price: 750000, cost: 375000, sku: 'TOASTER-001', barcode: '1234567890171', category: 'Home & Kitchen', stock: 25, min_stock: 6, max_stock: 50 },
		{ name: 'Blender', description: 'High-speed countertop blender', price: 1200000, cost: 600000, sku: 'BLENDER-001', barcode: '1234567890172', category: 'Home & Kitchen', stock: 15, min_stock: 4, max_stock: 30 },
		{ name: 'Microwave', description: 'Compact 0.7 cu ft microwave oven', price: 1950000, cost: 975000, sku: 'MICROWAVE-001', barcode: '1234567890173', category: 'Home & Kitchen', stock: 12, min_stock: 3, max_stock: 25 },
		{ name: 'Dinner Plates Set', description: 'Set of 4 ceramic dinner plates', price: 600000, cost: 300000, sku: 'PLATES-001', barcode: '1234567890174', category: 'Home & Kitchen', stock: 30, min_stock: 8, max_stock: 60 },
		{ name: 'Cutlery Set', description: 'Stainless steel cutlery set for 4', price: 450000, cost: 225000, sku: 'CUTLERY-001', barcode: '1234567890175', category: 'Home & Kitchen', stock: 25, min_stock: 6, max_stock: 50 },
		{ name: 'Kitchen Knife Set', description: 'Professional 5-piece knife set', price: 1500000, cost: 750000, sku: 'KNIVES-001', barcode: '1234567890176', category: 'Home & Kitchen', stock: 18, min_stock: 4, max_stock: 35 },
		{ name: 'Cutting Board', description: 'Bamboo cutting board with juice groove', price: 300000, cost: 150000, sku: 'BOARD-001', barcode: '1234567890177', category: 'Home & Kitchen', stock: 40, min_stock: 10, max_stock: 80 },
		{ name: 'Mixing Bowls Set', description: 'Set of 3 stainless steel mixing bowls', price: 375000, cost: 180000, sku: 'BOWLS-001', barcode: '1234567890178', category: 'Home & Kitchen', stock: 35, min_stock: 8, max_stock: 70 },
		{ name: 'Measuring Cups', description: 'Set of 4 plastic measuring cups', price: 195000, cost: 90000, sku: 'CUPS-001', barcode: '1234567890179', category: 'Home & Kitchen', stock: 50, min_stock: 12, max_stock: 100 },
		{ name: 'Oven Mitts', description: 'Heat-resistant silicone oven mitts', price: 225000, cost: 105000, sku: 'MITTS-001', barcode: '1234567890180', category: 'Home & Kitchen', stock: 30, min_stock: 8, max_stock: 60 },
		{ name: 'Dish Towels', description: 'Pack of 6 cotton dish towels', price: 255000, cost: 120000, sku: 'TOWELS-001', barcode: '1234567890181', category: 'Home & Kitchen', stock: 40, min_stock: 10, max_stock: 80 },
		{ name: 'Trash Can', description: '13-gallon stainless steel trash can', price: 525000, cost: 255000, sku: 'TRASH-001', barcode: '1234567890182', category: 'Home & Kitchen', stock: 20, min_stock: 5, max_stock: 40 },

		// Health & Beauty (15 products)
		{ name: 'Hand Sanitizer', description: 'Alcohol-based hand sanitizer, 8oz', price: 105000, cost: 45000, sku: 'SANITIZER-001', barcode: '1234567890183', category: 'Health & Beauty', stock: 100, min_stock: 25, max_stock: 200 },
		{ name: 'Face Mask', description: 'Pack of 50 disposable face masks', price: 195000, cost: 90000, sku: 'MASK-001', barcode: '1234567890184', category: 'Health & Beauty', stock: 80, min_stock: 20, max_stock: 160 },
		{ name: 'Thermometer', description: 'Digital infrared thermometer', price: 450000, cost: 225000, sku: 'THERMO-001', barcode: '1234567890185', category: 'Health & Beauty', stock: 25, min_stock: 6, max_stock: 50 },
		{ name: 'First Aid Kit', description: 'Complete 100-piece first aid kit', price: 375000, cost: 180000, sku: 'FIRSTAID-001', barcode: '1234567890186', category: 'Health & Beauty', stock: 15, min_stock: 4, max_stock: 30 },
		{ name: 'Bandages', description: 'Box of 100 assorted adhesive bandages', price: 135000, cost: 60000, sku: 'BANDAGE-001', barcode: '1234567890187', category: 'Health & Beauty', stock: 60, min_stock: 15, max_stock: 120 },
		{ name: 'Pain Reliever', description: 'Bottle of 100 pain relief tablets', price: 180000, cost: 90000, sku: 'PAIN-001', barcode: '1234567890188', category: 'Health & Beauty', stock: 40, min_stock: 10, max_stock: 80 },
		{ name: 'Vitamins', description: 'Multivitamin supplement, 60 tablets', price: 300000, cost: 150000, sku: 'VITAMIN-001', barcode: '1234567890189', category: 'Health & Beauty', stock: 35, min_stock: 8, max_stock: 70 },
		{ name: 'Shampoo', description: 'Moisturizing shampoo, 16oz', price: 150000, cost: 75000, sku: 'SHAMPOO-001', barcode: '1234567890190', category: 'Health & Beauty', stock: 50, min_stock: 12, max_stock: 100 },
		{ name: 'Body Lotion', description: 'Hydrating body lotion, 16oz', price: 195000, cost: 97500, sku: 'LOTION-001', barcode: '1234567890191', category: 'Health & Beauty', stock: 45, min_stock: 10, max_stock: 90 },
		{ name: 'Toothbrush', description: 'Soft-bristle toothbrush, 4-pack', price: 120000, cost: 60000, sku: 'BRUSH-001', barcode: '1234567890192', category: 'Health & Beauty', stock: 80, min_stock: 20, max_stock: 160 },
		{ name: 'Toothpaste', description: 'Fluoride toothpaste, 6oz', price: 75000, cost: 37500, sku: 'PASTE-001', barcode: '1234567890193', category: 'Health & Beauty', stock: 70, min_stock: 18, max_stock: 140 },
		{ name: 'Deodorant', description: 'Antiperspirant deodorant, 2.6oz', price: 90000, cost: 45000, sku: 'DEODORANT-001', barcode: '1234567890194', category: 'Health & Beauty', stock: 60, min_stock: 15, max_stock: 120 },
		{ name: 'Sunscreen', description: 'SPF 30 sunscreen lotion, 8oz', price: 225000, cost: 112500, sku: 'SUNSCREEN-001', barcode: '1234567890195', category: 'Health & Beauty', stock: 30, min_stock: 8, max_stock: 60 },
		{ name: 'Lip Balm', description: 'Moisturizing lip balm, 3-pack', price: 105000, cost: 52500, sku: 'LIPBALM-001', barcode: '1234567890196', category: 'Health & Beauty', stock: 90, min_stock: 20, max_stock: 180 },
		{ name: 'Cotton Swabs', description: 'Box of 500 cotton swabs', price: 60000, cost: 30000, sku: 'SWABS-001', barcode: '1234567890197', category: 'Health & Beauty', stock: 120, min_stock: 30, max_stock: 240 },

		// Sports & Outdoors (15 products)
		{ name: 'Yoga Mat', description: 'Non-slip exercise yoga mat', price: 450000, cost: 225000, sku: 'YOGA-001', barcode: '1234567890198', category: 'Sports & Outdoors', stock: 25, min_stock: 6, max_stock: 50 },
		{ name: 'Dumbbells Set', description: 'Set of 2 adjustable dumbbells', price: 1350000, cost: 675000, sku: 'DUMBBELL-001', barcode: '1234567890199', category: 'Sports & Outdoors', stock: 15, min_stock: 4, max_stock: 30 },
		{ name: 'Resistance Bands', description: 'Set of 5 resistance bands', price: 300000, cost: 150000, sku: 'BANDS-002', barcode: '1234567890200', category: 'Sports & Outdoors', stock: 40, min_stock: 10, max_stock: 80 },
		{ name: 'Jump Rope', description: 'Adjustable speed jump rope', price: 195000, cost: 97500, sku: 'ROPE-001', barcode: '1234567890201', category: 'Sports & Outdoors', stock: 35, min_stock: 8, max_stock: 70 },
		{ name: 'Water Bottle Sports', description: 'BPA-free sports water bottle', price: 255000, cost: 127500, sku: 'BOTTLE-002', barcode: '1234567890202', category: 'Sports & Outdoors', stock: 50, min_stock: 12, max_stock: 100 },
		{ name: 'Tennis Racket', description: 'Professional tennis racket', price: 2250000, cost: 1125000, sku: 'RACKET-001', barcode: '1234567890203', category: 'Sports & Outdoors', stock: 12, min_stock: 3, max_stock: 25 },
		{ name: 'Basketball', description: 'Official size basketball', price: 525000, cost: 262500, sku: 'BASKETBALL-001', barcode: '1234567890204', category: 'Sports & Outdoors', stock: 20, min_stock: 5, max_stock: 40 },
		{ name: 'Soccer Ball', description: 'FIFA approved soccer ball', price: 600000, cost: 300000, sku: 'SOCCER-001', barcode: '1234567890205', category: 'Sports & Outdoors', stock: 18, min_stock: 4, max_stock: 35 },
		{ name: 'Frisbee', description: 'Professional flying disc', price: 150000, cost: 75000, sku: 'FRISBEE-001', barcode: '1234567890206', category: 'Sports & Outdoors', stock: 30, min_stock: 8, max_stock: 60 },
		{ name: 'Camping Tent', description: '4-person camping tent', price: 3000000, cost: 1500000, sku: 'TENT-001', barcode: '1234567890207', category: 'Sports & Outdoors', stock: 8, min_stock: 2, max_stock: 15 },
		{ name: 'Sleeping Bag', description: '3-season sleeping bag', price: 1200000, cost: 600000, sku: 'SLEEPING-001', barcode: '1234567890208', category: 'Sports & Outdoors', stock: 15, min_stock: 4, max_stock: 30 },
		{ name: 'Backpack', description: '40L hiking backpack', price: 1350000, cost: 675000, sku: 'BACKPACK-001', barcode: '1234567890209', category: 'Sports & Outdoors', stock: 12, min_stock: 3, max_stock: 25 },
		{ name: 'Flashlight', description: 'LED tactical flashlight', price: 375000, cost: 187500, sku: 'FLASHLIGHT-001', barcode: '1234567890210', category: 'Sports & Outdoors', stock: 25, min_stock: 6, max_stock: 50 },
		{ name: 'Compass', description: 'Professional hiking compass', price: 300000, cost: 150000, sku: 'COMPASS-001', barcode: '1234567890211', category: 'Sports & Outdoors', stock: 20, min_stock: 5, max_stock: 40 },
		{ name: 'Binoculars', description: '10x42 waterproof binoculars', price: 1950000, cost: 975000, sku: 'BINOCULAR-001', barcode: '1234567890212', category: 'Sports & Outdoors', stock: 10, min_stock: 2, max_stock: 20 },

		// Books & Media (10 products)
		{ name: 'Programming Book', description: 'Learn JavaScript programming guide', price: 600000, cost: 300000, sku: 'BOOK-001', barcode: '1234567890213', category: 'Books & Media', stock: 30, min_stock: 8, max_stock: 60 },
		{ name: 'Business Book', description: 'Entrepreneurship and business strategy', price: 450000, cost: 225000, sku: 'BOOK-002', barcode: '1234567890214', category: 'Books & Media', stock: 25, min_stock: 6, max_stock: 50 },
		{ name: 'Cookbook', description: 'Healthy cooking recipes collection', price: 375000, cost: 187500, sku: 'BOOK-003', barcode: '1234567890215', category: 'Books & Media', stock: 20, min_stock: 5, max_stock: 40 },
		{ name: 'Novel', description: 'Bestselling fiction novel', price: 255000, cost: 127500, sku: 'BOOK-004', barcode: '1234567890216', category: 'Books & Media', stock: 40, min_stock: 10, max_stock: 80 },
		{ name: 'Magazine', description: 'Technology monthly magazine', price: 105000, cost: 52500, sku: 'MAG-001', barcode: '1234567890217', category: 'Books & Media', stock: 50, min_stock: 12, max_stock: 100 },
		{ name: 'DVD Movie', description: 'Latest blockbuster movie on DVD', price: 300000, cost: 150000, sku: 'DVD-001', barcode: '1234567890218', category: 'Books & Media', stock: 35, min_stock: 8, max_stock: 70 },
		{ name: 'CD Album', description: 'Popular music album on CD', price: 225000, cost: 112500, sku: 'CD-001', barcode: '1234567890219', category: 'Books & Media', stock: 30, min_stock: 8, max_stock: 60 },
		{ name: 'Board Game', description: 'Family strategy board game', price: 750000, cost: 375000, sku: 'GAME-001', barcode: '1234567890220', category: 'Books & Media', stock: 15, min_stock: 4, max_stock: 30 },
		{ name: 'Puzzle', description: '1000-piece jigsaw puzzle', price: 300000, cost: 150000, sku: 'PUZZLE-001', barcode: '1234567890221', category: 'Books & Media', stock: 25, min_stock: 6, max_stock: 50 },
		{ name: 'Coloring Book', description: 'Adult stress-relief coloring book', price: 195000, cost: 97500, sku: 'COLOR-001', barcode: '1234567890222', category: 'Books & Media', stock: 40, min_stock: 10, max_stock: 80 }
	]

	const products = await Promise.all(
		productData.map(product =>
			prisma.product.create({
				data: {
					...product,
					is_active: true,
				},
			})
		)
	)

	// Create sample customers
	const customers = await Promise.all([
		prisma.customer.create({
			data: {
				name: 'John Doe',
				email: 'john.doe@email.com',
				phone: '+1 (555) 123-4567',
				address: '123 Main Street',
				city: 'Anytown',
				state: 'CA',
				zip_code: '12345',
				country: 'USA',
				is_active: true,
			},
		}),
		prisma.customer.create({
			data: {
				name: 'Jane Smith',
				email: 'jane.smith@email.com',
				phone: '+1 (555) 987-6543',
				address: '456 Oak Avenue',
				city: 'Somewhere',
				state: 'NY',
				zip_code: '67890',
				country: 'USA',
				is_active: true,
			},
		}),
	])

	// Create sample sales
	const sale1 = await prisma.sale.create({
		data: {
			customer_id: customers[0].id,
			total: 19949700,
			subtotal: 18136050,
			tax: 1813650,
			discount: 0,
			payment_method: 'CARD',
			status: 'COMPLETED',
			notes: 'Customer requested receipt via email',
		},
	})

	const sale2 = await prisma.sale.create({
		data: {
			customer_id: customers[1].id,
			total: 749700,
			subtotal: 681600,
			tax: 68100,
			discount: 0,
			payment_method: 'CASH',
			status: 'COMPLETED',
			notes: 'Walk-in customer',
		},
	})

	// Create sale items
	await Promise.all([
		prisma.saleItem.create({
			data: {
				saleId: sale1.id,
				productId: products[0].id,
				quantity: 1,
				price: 19500000,
				discount: 0,
				total: 19500000,
			},
		}),
		prisma.saleItem.create({
			data: {
				saleId: sale1.id,
				productId: products[1].id,
				quantity: 1,
				price: 450000,
				discount: 0,
				total: 450000,
			},
		}),
		prisma.saleItem.create({
			data: {
				saleId: sale2.id,
				productId: products[1].id,
				quantity: 1,
				price: 450000,
				discount: 0,
				total: 450000,
			},
		}),
		prisma.saleItem.create({
			data: {
				saleId: sale2.id,
				productId: products[2].id,
				quantity: 1,
				price: 300000,
				discount: 0,
				total: 300000,
			},
		}),
	])

	console.log('✅ Database seeded successfully!')
	console.log(`📊 Created:`)
	console.log(`   - 1 POS Settings record`)
	console.log(`   - ${products.length} products across 7 categories`)
	console.log(`   - ${customers.length} customers`)
	console.log(`   - 2 sales with 4 sale items`)
}

main()
	.catch((e) => {
		console.error('❌ Error seeding database:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
