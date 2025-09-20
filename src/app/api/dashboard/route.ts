import { NextResponse } from 'next/server'
import { saleService, productService } from '@/lib/database'

export async function GET() {
	try {
		const [todaySales, products, lowStockItems] = await Promise.all([
			saleService.getTodaySales(),
			productService.getAll(),
			productService.getLowStock()
		])

		const stats = {
			todaySales: todaySales.total,
			todayTransactions: todaySales.count,
			totalProducts: products.length,
			lowStockItems: lowStockItems.length
		}

		return NextResponse.json(stats)
	} catch (error) {
		console.error('Error fetching dashboard stats:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch dashboard stats' },
			{ status: 500 }
		)
	}
}
