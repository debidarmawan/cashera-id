export interface Product {
	id: string;
	name: string;
	description: string | null;
	price: number;
	cost: number | null;
	sku: string | null;
	barcode: string | null;
	category: string | null;
	stock: number;
	min_stock: number;
	max_stock: number | null;
	is_active: boolean;
	image: string | null;
	created_at: string;
	updated_at: string;
}
