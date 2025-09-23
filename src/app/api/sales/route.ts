import { NextRequest, NextResponse } from 'next/server'
import { saleService } from '@/lib/database'

export async function GET() {
	try {
		const sales = await saleService.getAll()
		return NextResponse.json(sales)
	} catch (error) {
		console.error('Error fetching sales:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch sales' },
			{ status: 500 }
		)
	}
}

export async function POST(request: NextRequest) {
	try {
		const data = await request.json()
		const sale = await saleService.create(data)
		return NextResponse.json(sale, { status: 201 })
	} catch (error) {
		console.error('Error creating sale:', error)
		return NextResponse.json(
			{ error: 'Failed to create sale' },
			{ status: 500 }
		)
	}
}
