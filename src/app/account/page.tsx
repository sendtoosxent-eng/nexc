"use client";

import React, { useEffect, useState } from "react";

const AccountPage = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    fetch(`/api/my-orders?user_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders);
      });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">
        My Orders
      </h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="border p-5 rounded-lg mb-5"
        >
          <h2>Order #{order.id}</h2>

          <p>Total: UGX {order.total}</p>

          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
};

export default AccountPage;