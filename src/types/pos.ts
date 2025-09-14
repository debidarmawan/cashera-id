// POS System Type Definitions

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
  sku: string;
  category: string;
  image?: string;
  stock: number;
  minStock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  loyaltyPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  customerId?: string;
  customer?: Customer;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'digital';
  paymentStatus: 'pending' | 'completed' | 'refunded';
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  createdAt: Date;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'cash' | 'card' | 'digital';
  isActive: boolean;
  icon?: string;
}

export interface POSSettings {
  currency: string;
  taxRate: number;
  defaultPaymentMethod: string;
  receiptFooter?: string;
  lowStockAlert: boolean;
  autoPrintReceipt: boolean;
}

export interface DashboardStats {
  todaySales: number;
  todayTransactions: number;
  totalProducts: number;
  lowStockItems: number;
  topSellingProducts: Product[];
  recentSales: Sale[];
  salesChart: {
    labels: string[];
    data: number[];
  };
}
