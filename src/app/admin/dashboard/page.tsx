"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  Wallet,
} from "lucide-react";

const DashboardPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");

      const data = await res.json();

      setOrders(data.orders);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    orderId: number,
    status: string
  ) => {
    try {
      await fetch("/api/admin/update-order-status", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          orderId,
          status,
        }),
      });

      fetchOrders();

    } catch (error) {
      console.log(error);
    }
  };

  const totalRevenue = orders.reduce(
    (acc, item) => acc + Number(item.total),
    0
  );

  const pendingOrders = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  const approvedOrders = orders.filter(
    (o) => o.status === "Approved"
  ).length;

  return (
    <section className="min-h-screen bg-[#050816] text-white p-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">
            Nexcell Admin Dashboard
          </h1>

          <p className="text-gray-400">
            Manage orders and customers
          </p>
        </div>

        {/* CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <div className="bg-[#0f172a] rounded-2xl p-6 border border-sky-500/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400">
                  Total Orders
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {orders.length}
                </h2>
              </div>

              <ShoppingBag className="text-sky-400" size={40} />
            </div>
          </div>

          <div className="bg-[#0f172a] rounded-2xl p-6 border border-yellow-500/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400">
                  Pending
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {pendingOrders}
                </h2>
              </div>

              <Clock className="text-yellow-400" size={40} />
            </div>
          </div>

          <div className="bg-[#0f172a] rounded-2xl p-6 border border-green-500/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400">
                  Approved
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {approvedOrders}
                </h2>
              </div>

              <CheckCircle
                className="text-green-400"
                size={40}
              />
            </div>
          </div>

          <div className="bg-[#0f172a] rounded-2xl p-6 border border-sky-500/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400">
                  Revenue
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  UGX {totalRevenue.toLocaleString()}
                </h2>
              </div>

              <Wallet className="text-sky-400" size={40} />
            </div>
          </div>
        </div>

        {/* TABLE */}

        <div className="bg-[#0f172a] rounded-3xl overflow-hidden border border-white/10">

          <div className="overflow-x-auto">

            <table className="w-full">
              <thead className="bg-sky-500 text-black">
                <tr>
                  <th className="text-left p-4">
                    Order
                  </th>

                  <th className="text-left p-4">
                    Customer
                  </th>

                  <th className="text-left p-4">
                    Total
                  </th>

                  <th className="text-left p-4">
                    Status
                  </th>

                  <th className="text-left p-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/10"
                  >
                    <td className="p-4">
                      #{order.id}
                    </td>

                    <td className="p-4">
                      <div>
                        <h3 className="font-semibold">
                          {order.customer_name}
                        </h3>

                        <p className="text-sm text-gray-400">
                          {order.customer_email}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      UGX {Number(order.total).toLocaleString()}
                    </td>

                    <td className="p-4">
                      <span
                        className={`
                          px-3 py-1 rounded-full text-sm font-medium
                          ${
                            order.status === "Approved"
                              ? "bg-green-500/20 text-green-400"
                              : order.status === "Delivered"
                              ? "bg-blue-500/20 text-blue-400"
                              : order.status === "Cancelled"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }
                        `}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(
                            order.id,
                            e.target.value
                          )
                        }
                        className="
                          bg-black
                          border
                          border-sky-500/30
                          rounded-lg
                          px-4
                          py-2
                          outline-none
                        "
                      >
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && orders.length === 0 && (
              <div className="p-10 text-center text-gray-400">
                No orders found
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;