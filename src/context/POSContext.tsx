"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product, CartItem, Sale, Customer, POSSettings, DashboardStats } from '@/types/pos';
import { sampleProducts, sampleCustomers, sampleSales } from '@/data/sampleData';

// POS State Interface
interface POSState {
  cart: CartItem[];
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  settings: POSSettings;
  currentCustomer?: Customer;
  isLoading: boolean;
  error?: string;
}

// POS Actions
type POSAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'SET_SALES'; payload: Sale[] }
  | { type: 'SET_SETTINGS'; payload: POSSettings }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CURRENT_CUSTOMER'; payload: Customer | undefined }
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string };

// Initial State
const initialState: POSState = {
  cart: [],
  products: [],
  customers: [],
  sales: [],
  settings: {
    currency: 'USD',
    taxRate: 0.08,
    defaultPaymentMethod: 'cash',
    lowStockAlert: true,
    autoPrintReceipt: false,
  },
  currentCustomer: undefined,
  isLoading: false,
  error: undefined,
};

// POS Reducer
function posReducer(state: POSState, action: POSAction): POSState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload };
    
    case 'SET_SALES':
      return { ...state, sales: action.payload };
    
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItem = state.cart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * product.price }
              : item
          ),
        };
      }
      
      return {
        ...state,
        cart: [...state.cart, { product, quantity, subtotal: quantity * product.price }],
      };
    }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload),
      };
    
    case 'UPDATE_CART_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item.product.id !== productId),
        };
      }
      
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === productId
            ? { ...item, quantity, subtotal: quantity * item.product.price }
            : item
        ),
      };
    }
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'SET_CURRENT_CUSTOMER':
      return { ...state, currentCustomer: action.payload };
    
    case 'ADD_SALE':
      return { ...state, sales: [action.payload, ...state.sales] };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p),
      };
    
    case 'ADD_PRODUCT':
      return { ...state, products: [action.payload, ...state.products] };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };
    
    default:
      return state;
  }
}

// POS Context
const POSContext = createContext<{
  state: POSState;
  dispatch: React.Dispatch<POSAction>;
} | null>(null);

// POS Provider
export function POSProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(posReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedProducts = localStorage.getItem('pos-products');
        const savedCustomers = localStorage.getItem('pos-customers');
        const savedSales = localStorage.getItem('pos-sales');
        const savedSettings = localStorage.getItem('pos-settings');

        // Load products
        if (savedProducts) {
          dispatch({ type: 'SET_PRODUCTS', payload: JSON.parse(savedProducts) });
        } else {
          // Load sample data if no saved data
          dispatch({ type: 'SET_PRODUCTS', payload: sampleProducts });
        }

        // Load customers
        if (savedCustomers) {
          dispatch({ type: 'SET_CUSTOMERS', payload: JSON.parse(savedCustomers) });
        } else {
          dispatch({ type: 'SET_CUSTOMERS', payload: sampleCustomers });
        }

        // Load sales
        if (savedSales) {
          dispatch({ type: 'SET_SALES', payload: JSON.parse(savedSales) });
        } else {
          dispatch({ type: 'SET_SALES', payload: sampleSales });
        }

        // Load settings
        if (savedSettings) {
          dispatch({ type: 'SET_SETTINGS', payload: JSON.parse(savedSettings) });
        }
      } catch (error) {
        console.error('Error loading POS data:', error);
        // Fallback to sample data on error
        dispatch({ type: 'SET_PRODUCTS', payload: sampleProducts });
        dispatch({ type: 'SET_CUSTOMERS', payload: sampleCustomers });
        dispatch({ type: 'SET_SALES', payload: sampleSales });
      }
    };

    loadData();
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('pos-products', JSON.stringify(state.products));
  }, [state.products]);

  useEffect(() => {
    localStorage.setItem('pos-customers', JSON.stringify(state.customers));
  }, [state.customers]);

  useEffect(() => {
    localStorage.setItem('pos-sales', JSON.stringify(state.sales));
  }, [state.sales]);

  useEffect(() => {
    localStorage.setItem('pos-settings', JSON.stringify(state.settings));
  }, [state.settings]);

  return (
    <POSContext.Provider value={{ state, dispatch }}>
      {children}
    </POSContext.Provider>
  );
}

// POS Hook
export function usePOS() {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
}

// Helper functions
export const POSHelpers = {
  calculateCartTotal: (cart: CartItem[], taxRate: number) => {
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * taxRate;
    return { subtotal, tax, total: subtotal + tax };
  },

  getLowStockProducts: (products: Product[]) => {
    return products.filter(product => product.stock <= product.minStock);
  },

  getDashboardStats: (sales: Sale[], products: Product[]): DashboardStats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySales = sales
      .filter(sale => new Date(sale.createdAt) >= today)
      .reduce((sum, sale) => sum + sale.total, 0);
    
    const todayTransactions = sales
      .filter(sale => new Date(sale.createdAt) >= today).length;
    
    const lowStockItems = products.filter(p => p.stock <= p.minStock).length;
    
    const topSellingProducts = products
      .sort((a, b) => b.stock - a.stock) // This would be based on actual sales data
      .slice(0, 5);
    
    const recentSales = sales.slice(0, 5);
    
    // Generate sales chart data for the last 7 days
    const salesChart = {
      labels: Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      }),
      data: Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return sales
          .filter(sale => {
            const saleDate = new Date(sale.createdAt);
            return saleDate.toDateString() === date.toDateString();
          })
          .reduce((sum, sale) => sum + sale.total, 0);
      }),
    };

    return {
      todaySales,
      todayTransactions,
      totalProducts: products.length,
      lowStockItems,
      topSellingProducts,
      recentSales,
      salesChart,
    };
  },
};
