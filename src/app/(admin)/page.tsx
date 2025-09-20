"use client";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { usePOS, POSHelpers } from "@/context/POSContext";
import { 
  BoxCubeIcon, 
  DollarLineIcon, 
  UserCircleIcon, 
  AlertIcon 
} from "@/icons/index";

export default function UnifiedDashboard() {
  const { state } = usePOS();
  const posStats = POSHelpers.getDashboardStats(state.sales, state.products);

  const posStatCards = [
    {
      title: "Today's Sales",
      value: `Rp ${posStats.todaySales.toLocaleString('id-ID')}`,
      icon: <DollarLineIcon />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "POS Transactions",
      value: posStats.todayTransactions.toString(),
      icon: <BoxCubeIcon />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Products",
      value: posStats.totalProducts.toString(),
      icon: <UserCircleIcon />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Low Stock Items",
      value: posStats.lowStockItems.toString(),
      icon: <AlertIcon />,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* POS Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posStatCards.map((card, index) => (
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


      {/* Original Ecommerce Dashboard */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />
          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}