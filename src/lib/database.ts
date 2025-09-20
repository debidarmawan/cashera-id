import { prisma } from './prisma'
import { Product, Customer, Sale, POSSettings, PaymentMethod } from '@prisma/client'

// Product operations
export const productService = {
	async getAll(): Promise<Product[]> {
		return prisma.product.findMany({
			orderBy: { name: 'asc' }
		})
	},

	async getById(id: string): Promise<Product | null> {
		return prisma.product.findUnique({
			where: { id }
		})
	},

	async create(data: {
		name: string
		description?: string
		price: number
		cost?: number
		sku?: string
		barcode?: string
		category?: string
		stock?: number
		min_stock?: number
		max_stock?: number
		image?: string
	}): Promise<Product> {
		return prisma.product.create({
			data: {
				...data,
				price: data.price,
				cost: data.cost,
			}
		})
	},

	async update(id: string, data: Partial<{
		name: string
		description: string
		price: number
		cost: number
		sku: string
		barcode: string
		category: string
		stock: number
		min_stock: number
		max_stock: number
		is_active: boolean
		image: string
	}>): Promise<Product> {
		return prisma.product.update({
			where: { id },
			data
		})
	},

	async delete(id: string): Promise<void> {
		await prisma.product.delete({
			where: { id }
		})
	},

	async getLowStock(): Promise<Product[]> {
		const settings = await prisma.pOSSettings.findFirst()
		const threshold = settings?.low_stock_threshold || 10

		return prisma.product.findMany({
			where: {
				stock: {
					lte: threshold
				},
				is_active: true
			},
			orderBy: { stock: 'asc' }
		})
	}
}

// Customer operations
export const customerService = {
	async getAll(): Promise<Customer[]> {
		return prisma.customer.findMany({
			orderBy: { name: 'asc' }
		})
	},

	async getById(id: string): Promise<Customer | null> {
		return prisma.customer.findUnique({
			where: { id }
		})
	},

	async create(data: {
		name: string
		email?: string
		phone?: string
		address?: string
		city?: string
		state?: string
		zip_code?: string
		country?: string
	}): Promise<Customer> {
		return prisma.customer.create({
			data
		})
	},

	async update(id: string, data: Partial<{
		name: string
		email: string
		phone: string
		address: string
		city: string
		state: string
		zip_code: string
		country: string
		is_active: boolean
	}>): Promise<Customer> {
		return prisma.customer.update({
			where: { id },
			data
		})
	},

	async delete(id: string): Promise<void> {
		await prisma.customer.delete({
			where: { id }
		})
	}
}

// Sale operations
export const saleService = {
	async getAll() {
		return prisma.sale.findMany({
			include: {
				customer: true,
				items: {
					include: {
						product: true
					}
				}
			},
			orderBy: { created_at: 'desc' }
		})
	},

	async getById(id: string) {
		return prisma.sale.findUnique({
			where: { id },
			include: {
				customer: true,
				items: {
					include: {
						product: true
					}
				}
			}
		})
	},

	async create(data: {
		customer_id?: string
		items: {
			productId: string
			quantity: number
			price: number
			discount?: number
		}[]
		payment_method: PaymentMethod
		notes?: string
		discount?: number
	}): Promise<Sale> {
		const settings = await prisma.pOSSettings.findFirst()
		const taxRate = settings?.tax_rate || 0.1

		// Calculate totals
		const subtotal = data.items.reduce((sum, item) => {
			const itemTotal = (Number(item.price) * item.quantity) - (item.discount || 0)
			return sum + itemTotal
		}, 0)

		const discountAmount = data.discount || 0
		const taxableAmount = subtotal - discountAmount
		const tax = taxableAmount * Number(taxRate)
		const total = taxableAmount + tax

		// Create sale with items in a transaction
		return prisma.$transaction(async (tx) => {
			const sale = await tx.sale.create({
				data: {
					customer_id: data.customer_id,
					total,
					subtotal,
					tax,
					discount: discountAmount,
					payment_method: data.payment_method,
					status: 'COMPLETED',
					notes: data.notes,
				}
			})

			// Create sale items
			await Promise.all(
				data.items.map(item =>
					tx.saleItem.create({
						data: {
							saleId: sale.id,
							productId: item.productId,
							quantity: item.quantity,
							price: item.price,
							discount: item.discount || 0,
							total: (Number(item.price) * item.quantity) - (item.discount || 0),
						}
					})
				)
			)

			// Update product stock
			await Promise.all(
				data.items.map(item =>
					tx.product.update({
						where: { id: item.productId },
						data: {
							stock: {
								decrement: item.quantity
							}
						}
					})
				)
			)

			return sale
		})
	},

	async getTodaySales(): Promise<{ total: number; count: number }> {
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const tomorrow = new Date(today)
		tomorrow.setDate(tomorrow.getDate() + 1)

		const sales = await prisma.sale.findMany({
			where: {
				created_at: {
					gte: today,
					lt: tomorrow
				},
				status: 'COMPLETED'
			}
		})

		const total = sales.reduce((sum, sale) => sum + Number(sale.total), 0)
		const count = sales.length

		return { total, count }
	}
}

// Settings operations
export const settingsService = {
	async get(): Promise<POSSettings | null> {
		return prisma.pOSSettings.findFirst()
	},

	async update(data: Partial<{
		store_name: string
		store_address: string
		store_phone: string
		store_email: string
		tax_rate: number
		currency: string
		receipt_header: string
		receipt_footer: string
		low_stock_threshold: number
		auto_print_receipt: boolean
	}>): Promise<POSSettings> {
		const existing = await prisma.pOSSettings.findFirst()

		if (existing) {
			return prisma.pOSSettings.update({
				where: { id: existing.id },
				data
			})
		} else {
			return prisma.pOSSettings.create({
				data: {
					store_name: data.store_name || 'POS Store',
					store_address: data.store_address,
					store_phone: data.store_phone,
					store_email: data.store_email,
					tax_rate: data.tax_rate || 0.1,
					currency: data.currency || 'USD',
					receipt_header: data.receipt_header,
					receipt_footer: data.receipt_footer,
					low_stock_threshold: data.low_stock_threshold || 10,
					auto_print_receipt: data.auto_print_receipt || false,
				}
			})
		}
	}
}
