import { NextRequest, NextResponse } from 'next/server'
import { productService } from '@/lib/database'

export async function GET() {
	try {
		const products = await productService.getAll()
		return NextResponse.json(products)
	} catch (error) {
		console.error('Error fetching products:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch products' },
			{ status: 500 }
		)
	}
}

export async function POST(request: NextRequest) {
	try {
		const data = await request.json()
		const product = await productService.create(data)
		return NextResponse.json(product, { status: 201 })
	} catch (error) {
		console.error('Error creating product:', error)
		return NextResponse.json(
			{ error: 'Failed to create product' },
			{ status: 500 }
		)
	}
}
