"use client";

import React from 'react';
import { usePOS, POSHelpers } from '@/context/POSContext';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { 
  BoxCubeIcon, 
  DollarLineIcon, 
  UserCircleIcon, 
  AlertIcon 
} from '@/icons/index';

export default function POSDashboard() {
  const { state } = usePOS();
  const stats = POSHelpers.getDashboardStats(state.sales, state.products);

  const statCards = [
    {
      title: "Today's Sales",
      value: `$${stats.todaySales.toFixed(2)}`,
      icon: <DollarLineIcon />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Transactions",
      value: stats.todayTransactions.toString(),
      icon: <BoxCubeIcon />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      icon: <UserCircleIcon />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems.toString(),
      icon: <AlertIcon />,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="POS Dashboard" />
      
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <div className={`w-6 h-6 ${card.color}`}>
                    {card.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <ComponentCard title="Quick Actions">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/pos/checkout"
              className="flex items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <DollarLineIcon />
                </div>
                <h3 className="font-semibold text-gray-900">New Sale</h3>
                <p className="text-sm text-gray-600">Start a new transaction</p>
              </div>
            </a>

            <a
              href="/pos/products"
              className="flex items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BoxCubeIcon />
                </div>
                <h3 className="font-semibold text-gray-900">Manage Products</h3>
                <p className="text-sm text-gray-600">Add or edit products</p>
              </div>
            </a>

            <a
              href="/pos/sales"
              className="flex items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <UserCircleIcon />
                </div>
                <h3 className="font-semibold text-gray-900">View Sales</h3>
                <p className="text-sm text-gray-600">Transaction history</p>
              </div>
            </a>
          </div>
        </ComponentCard>

        {/* Recent Sales */}
        <ComponentCard title="Recent Sales">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sale ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {stats.recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{sale.id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {sale.customer?.name || 'Walk-in Customer'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${sale.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        sale.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : sale.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
