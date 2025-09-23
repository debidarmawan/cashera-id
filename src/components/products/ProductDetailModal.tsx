"use client";

import React from 'react';
import Image from 'next/image';
import Badge from '@/components/ui/badge/Badge';
import { Product } from '@/types/product';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onEdit: () => void;
}

export default function ProductDetailModal({ product, onClose, onEdit }: ProductDetailModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { status: 'Out of Stock', color: 'text-red-600 dark:text-red-400' };
    if (stock <= minStock) return { status: 'Low Stock', color: 'text-yellow-600 dark:text-yellow-400' };
    return { status: 'In Stock', color: 'text-green-600 dark:text-green-400' };
  };

  const stockInfo = getStockStatus(product.stock, product.min_stock);

  return (
    <div 
      className="fixed inset-0 bg-transparent flex items-center justify-center z-[60] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Product Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Product Image & Basic Info */}
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-4xl text-gray-400">📦</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge
                    size="sm"
                    color={product.is_active ? 'success' : 'error'}
                  >
                    {product.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className={`text-sm font-medium ${stockInfo.color}`}>
                    {stockInfo.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              {/* Key Information Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Price</div>
                  <div className="text-lg font-bold text-blue-900 dark:text-blue-100">Rp {Number(product.price).toLocaleString('id-ID')}</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <div className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">Stock</div>
                  <div className="text-lg font-bold text-green-900 dark:text-green-100">{product.stock}</div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Category:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{product.category || 'Uncategorized'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">SKU:</span>
                    <span className="ml-2 font-mono text-gray-900 dark:text-white">{product.sku || 'Not set'}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Cost:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {product.cost ? `Rp ${Number(product.cost).toLocaleString('id-ID')}` : 'Not set'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Min Stock:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{product.min_stock}</span>
                  </div>
                </div>

                {product.barcode && (
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Barcode:</span>
                    <span className="ml-2 font-mono text-gray-900 dark:text-white">{product.barcode}</span>
                  </div>
                )}

                {product.max_stock && (
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Max Stock:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{product.max_stock}</span>
                  </div>
                )}
              </div>

              {/* Timestamps */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Created:</span>
                    <div className="text-gray-900 dark:text-white">{formatDate(product.created_at)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Updated:</span>
                    <div className="text-gray-900 dark:text-white">{formatDate(product.updated_at)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-2 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
