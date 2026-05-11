"use client";

import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders);
      });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="space-y-5">
        {orders.map((order: any) => (
          <div
            key={order.id}
            className="border p-5 rounded-lg bg-white"
          >
            <h2 className="font-bold">
              Order #{order.id}
            </h2>

            <p>{order.customer_name}</p>

            <p>{order.customer_email}</p>

            <p>Status: {order.status}</p>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded mt-4"
            >
              Confirm Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;