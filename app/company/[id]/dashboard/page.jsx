"use client";

import React, { useEffect, useState } from "react";
import { useProductStore } from "../../../store/useProductStore";
import { usePromotionsStore } from "../../../store/usePromotionsStore";
import { useShopOrderStore } from "../../../store/useShopOrder";
import { Package, ShoppingBag, TicketPercent } from "lucide-react";

import StatCard, { StatCardSkeleton } from "../../../components/company/dashboard/StatCard";
import SummaryBarChart from "../../../components/company/dashboard/SummaryBarChart";


export default function DashboardPage() {
  const productStore = useProductStore();
  const promotionStore = usePromotionsStore();
  const orderStore = useShopOrderStore();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalPromotions: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      await Promise.all([
        productStore.fetchProducts(),
        promotionStore.fetchPromotions(),
        orderStore.fetchOrders(),
      ]);

      setStats({
        totalProducts: productStore.products.length,
        totalOrders: orderStore.orders.length,
        totalPromotions: promotionStore.promotions.length,
      });

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <p className="mt-1 text-sm text-slate-500">
        A high-level overview of your store's activity.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              icon={Package}
              color="indigo"
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={ShoppingBag}
              color="blue"
            />
            <StatCard
              title="Active Promotions"
              value={stats.totalPromotions}
              icon={TicketPercent}
              color="green"
            />
          </>
        )}
      </div>
      <div className="mt-6">
        <SummaryBarChart stats={stats} />
      </div>
    </div>
  );
}
