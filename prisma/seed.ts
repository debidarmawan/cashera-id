import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	console.log('🌱 Seeding database...')

	// Create POS Settings
	const settings = await prisma.pOSSettings.create({
		data: {
			store_name: 'Cashera POS Store',
			store_address: '123 Business Street, City, State 12345',
			store_phone: '+1 (555) 123-4567',
			store_email: 'info@cashera.com',
			tax_rate: 0.1,
			currency: 'USD',
			receipt_header: 'Thank you for your business!',
			receipt_footer: 'Visit us again soon!',
			low_stock_threshold: 10,
			auto_print_receipt: false,
		},
	})

	// Create sample products
	const products = await Promise.all([
		prisma.product.create({
			data: {
				name: 'Laptop Computer',
				description: 'High-performance laptop for business use',
				price: 1299.99,
				cost: 800.00,
				sku: 'LAPTOP-001',
				barcode: '1234567890123',
				category: 'Electronics',
				stock: 25,
				min_stock: 5,
				max_stock: 50,
				is_active: true,
			},
		}),
		prisma.product.create({
			data: {
				name: 'Wireless Mouse',
				description: 'Ergonomic wireless mouse with USB receiver',
				price: 29.99,
				cost: 15.00,
				sku: 'MOUSE-001',
				barcode: '1234567890124',
				category: 'Accessories',
				stock: 100,
				min_stock: 20,
				max_stock: 200,
				is_active: true,
			},
		}),
		prisma.product.create({
			data: {
				name: 'USB-C Cable',
				description: 'High-speed USB-C to USB-C cable, 6ft',
				price: 19.99,
				cost: 8.00,
				sku: 'CABLE-001',
				barcode: '1234567890125',
				category: 'Accessories',
				stock: 75,
				min_stock: 15,
				max_stock: 150,
				is_active: true,
			},
		}),
		prisma.product.create({
			data: {
				name: 'Coffee Mug',
				description: 'Ceramic coffee mug with company logo',
				price: 12.99,
				cost: 5.00,
				sku: 'MUG-001',
				barcode: '1234567890126',
				category: 'Merchandise',
				stock: 8,
				min_stock: 10,
				max_stock: 50,
				is_active: true,
			},
		}),
	])

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
			total: 1329.98,
			subtotal: 1209.07,
			tax: 120.91,
			discount: 0,
			payment_method: 'CARD',
			status: 'COMPLETED',
			notes: 'Customer requested receipt via email',
		},
	})

	const sale2 = await prisma.sale.create({
		data: {
			customer_id: customers[1].id,
			total: 49.98,
			subtotal: 45.44,
			tax: 4.54,
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
				price: 1299.99,
				discount: 0,
				total: 1299.99,
			},
		}),
		prisma.saleItem.create({
			data: {
				saleId: sale1.id,
				productId: products[1].id,
				quantity: 1,
				price: 29.99,
				discount: 0,
				total: 29.99,
			},
		}),
		prisma.saleItem.create({
			data: {
				saleId: sale2.id,
				productId: products[1].id,
				quantity: 1,
				price: 29.99,
				discount: 0,
				total: 29.99,
			},
		}),
		prisma.saleItem.create({
			data: {
				saleId: sale2.id,
				productId: products[2].id,
				quantity: 1,
				price: 19.99,
				discount: 0,
				total: 19.99,
			},
		}),
	])

	console.log('✅ Database seeded successfully!')
	console.log(`📊 Created:`)
	console.log(`   - 1 POS Settings record`)
	console.log(`   - ${products.length} products`)
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
