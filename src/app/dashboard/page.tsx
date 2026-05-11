"use client";

import React, { useEffect, useState } from "react";

const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedOrder = localStorage.getItem("lastOrder");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
    }
  }, []);

  return (
    <section className="min-h-screen bg-gray-100 py-16 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-2xl shadow p-8 mb-8">
          <h1 className="text-3xl font-bold mb-3">
            Welcome {user?.name || "Customer"} 👋
          </h1>

          <p className="text-gray-600">
            Track your orders and account activity.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Latest Order
          </h2>

          {order ? (
            <div className="space-y-5">

              <div className="flex justify-between border-b pb-4">
                <span className="font-medium">Order ID</span>
                <span>#{order.orderId}</span>
              </div>

              <div className="flex justify-between border-b pb-4">
                <span className="font-medium">Total</span>
                <span>
                  UGX {Number(order.total).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between border-b pb-4">
                <span className="font-medium">Status</span>

                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                  {order.status}
                </span>
              </div>

              <div className="pt-2">
                <p className="text-gray-600">
                  Your order is waiting for admin confirmation.
                </p>
              </div>
            </div>
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;