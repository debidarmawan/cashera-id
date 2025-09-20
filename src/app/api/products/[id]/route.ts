import { NextRequest, NextResponse } from 'next/server'
import { productService } from '@/lib/database'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const product = await productService.getById(id)
		if (!product) {
			return NextResponse.json(
				{ error: 'Product not found' },
				{ status: 404 }
			)
		}
		return NextResponse.json(product)
	} catch (error) {
		console.error('Error fetching product:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch product' },
			{ status: 500 }
		)
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const data = await request.json()
		const product = await productService.update(id, data)
		return NextResponse.json(product)
	} catch (error) {
		console.error('Error updating product:', error)
		return NextResponse.json(
			{ error: 'Failed to update product' },
			{ status: 500 }
		)
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		await productService.delete(id)
		return NextResponse.json({ message: 'Product deleted successfully' })
	} catch (error) {
		console.error('Error deleting product:', error)
		return NextResponse.json(
			{ error: 'Failed to delete product' },
			{ status: 500 }
		)
	}
}
