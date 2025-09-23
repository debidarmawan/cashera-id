"use client";

import React, { useState, useEffect } from 'react';
import { usePOS, POSHelpers } from '@/context/POSContext';
import { Product } from '@/types/product';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import Image from 'next/image';

export default function CheckoutPage() {
  const { state, dispatch } = usePOS();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital'>('cash');
  const [amountReceived, setAmountReceived] = useState(0);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          console.log('Products loaded:', data.length, 'products');
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const { subtotal, tax, total } = POSHelpers.calculateCartTotal(state.cart, state.settings.taxRate);
  const change = amountReceived - total;

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[]];
  
  const filteredProducts = products.filter(product => {
    if (!searchTerm.trim()) {
      // If no search term, just filter by category and active/stock status
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesCategory && product.is_active && product.stock > 0;
    }
    
    // Search in multiple fields
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      product.name.toLowerCase().includes(searchLower) ||
      (product.sku && product.sku.toLowerCase().includes(searchLower)) ||
      (product.barcode && product.barcode.toLowerCase().includes(searchLower)) ||
      (product.description && product.description.toLowerCase().includes(searchLower)) ||
      (product.category && product.category.toLowerCase().includes(searchLower));
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const result = matchesSearch && matchesCategory && product.is_active && product.stock > 0;
    
    // Debug logging for search issues
    if (searchTerm && result) {
      console.log('Found product:', product.name, 'for search:', searchTerm);
    }
    
    return result;
  });

  const handleAddToCart = (product: Product) => {
    if (product.stock > 0) {
      // Convert database product to POS product format
      const posProduct = {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        stock: product.stock,
        sku: product.sku || '',
        category: product.category || '',
        isActive: product.is_active,
        image: product.image || undefined,
        description: product.description || undefined,
        cost: product.cost ? Number(product.cost) : 0,
        minStock: product.min_stock,
        createdAt: new Date(product.created_at),
        updatedAt: new Date(product.updated_at)
      };
      dispatch({ type: 'ADD_TO_CART', payload: { product: posProduct, quantity: 1 } });
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
  };

  const handleRemoveFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const handleCheckout = () => {
    if (state.cart.length === 0) return;

    const sale = {
      id: `sale_${Date.now()}`,
      customerId: state.currentCustomer?.id,
      customer: state.currentCustomer,
      items: state.cart,
      subtotal,
      tax,
      discount: 0,
      total,
      paymentMethod,
      paymentStatus: 'completed' as const,
      status: 'completed' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch({ type: 'ADD_SALE', payload: sale });
    dispatch({ type: 'CLEAR_CART' });
    setShowPaymentModal(false);
    setAmountReceived(0);
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Product Selection */}
        <div className="lg:col-span-2">
          <ComponentCard title="Products">
            {/* Search and Filter */}
            <div className="mb-6 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search products by name, SKU, barcode, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Debug info - remove in production */}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Products loaded: {products.length} | Filtered: {filteredProducts.length} | Search: &quot;{searchTerm}&quot; | Category: {selectedCategory}
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[calc(100vh-400px)] overflow-y-auto">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleAddToCart(product)}
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-gray-400 text-2xl">📦</div>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-1 truncate">{product.name}</h3>
                    <p className="text-lg font-bold text-blue-600">Rp {Number(product.price).toLocaleString('id-ID')}</p>
                    <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📦</div>
                  <p>No products found</p>
                  <p className="text-sm">Try adjusting your search or category filter</p>
                </div>
              )}
            </div>
          </ComponentCard>
        </div>

        {/* Cart and Checkout */}
        <div className="lg:col-span-1">
          <ComponentCard title="Shopping Cart">
            {state.cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🛒</div>
                <p>Your cart is empty</p>
                <p className="text-sm">Add products to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Cart Items */}
                <div className="h-[calc(100vh-380px)] overflow-y-auto space-y-2">
                  {state.cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <p className="text-xs text-gray-500">Rp {item.product.price.toLocaleString('id-ID')} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveFromCart(item.product.id)}
                          className="w-6 h-6 bg-red-200 text-red-600 rounded-full flex items-center justify-center text-sm ml-2"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax ({(state.settings.taxRate * 100).toFixed(1)}%):</span>
                    <span>Rp {tax.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Checkout - Rp {total.toLocaleString('id-ID')}
                </Button>
              </div>
            )}
          </ComponentCard>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div 
          className="fixed inset-0 bg-transparent flex items-center justify-center z-[60] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPaymentModal(false);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment</h2>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Summary */}
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white">Order Summary</h3>
                  
                  {/* Cart Items */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {state.cart.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white">{item.product.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Rp {item.product.price.toLocaleString('id-ID')} × {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Totals */}
                  <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                      <span className="text-gray-900 dark:text-white">Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tax ({(state.settings.taxRate * 100).toFixed(1)}%):</span>
                      <span className="text-gray-900 dark:text-white">Rp {tax.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
                      <span className="text-gray-900 dark:text-white">Total:</span>
                      <span className="text-green-600 dark:text-green-400">Rp {total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white">Payment Details</h3>
                  
                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['cash', 'card', 'digital'].map((method) => (
                        <button
                          key={method}
                          onClick={() => setPaymentMethod(method as 'cash' | 'card' | 'digital')}
                          className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                            paymentMethod === method
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 text-blue-700 dark:text-blue-300'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          {method.charAt(0).toUpperCase() + method.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Received (Cash only) */}
                  {paymentMethod === 'cash' && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Amount Received</label>
                      <input
                        type="number"
                        value={amountReceived || ''}
                        onChange={(e) => setAmountReceived(Number(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Enter amount received"
                        step="1"
                        min="0"
                      />
                      {amountReceived > 0 && (
                        <div className={`mt-2 p-2 rounded-lg ${change >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                          <p className={`text-sm font-medium ${change >= 0 ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                            Change: Rp {change.toLocaleString('id-ID')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Total Display (Non-cash) */}
                  {paymentMethod !== 'cash' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Total Amount</div>
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">Rp {total.toLocaleString('id-ID')}</div>
                    </div>
                  )}

                  {/* Warning Message */}
                  {paymentMethod === 'cash' && (amountReceived < total || amountReceived <= 0) && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Please enter the amount received from customer
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                disabled={paymentMethod === 'cash' && (amountReceived < total || amountReceived <= 0)}
                className={`px-6 py-2 text-sm rounded-lg transition-colors flex items-center space-x-2 ${
                  paymentMethod === 'cash' && (amountReceived < total || amountReceived <= 0)
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Complete Sale</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
