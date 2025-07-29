"use client";
import React from 'react';
import OrdersPage from '../../../components/company/OrdersPage';
import { useParams } from 'next/navigation';

const MyOrders = () => {
  const params = useParams();
  const userId = params.userId; // or params.id if that is the param name

  return <OrdersPage userId={userId} />;
};

export default MyOrders;

