"use client";
import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0, users: 0, approved: 0, pending: 0, declined: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch("/api/admin/dashboard-data");
    const data = await res.json();
    setOrders(data.orders);
    setStats(data.stats);
  };

  const updateStatus = async (orderId: number, newStatus: string) => {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
    fetchData(); // Refresh data
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800">Admin Command Center</h1>
        <button onClick={() => {/* Open Profile Edit Modal */}} className="bg-white border p-2 rounded shadow-sm">
          Edit Profile
        </button>
      </header>

      {/* Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
        <StatCard title="Total Orders" value={stats.total} color="blue" />
        <StatCard title="New Users" value={stats.users} color="purple" />
        <StatCard title="Approved" value={stats.approved} color="green" />
        <StatCard title="Pending" value={stats.pending} color="amber" />
        <StatCard title="Declined" value={stats.declined} color="red" />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">#{order.id}</td>
                <td className="p-4">
                  <div className="font-bold">{order.customer_name}</div>
                  <div className="text-xs text-gray-500">{order.customer_email}</div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  <button onClick={() => updateStatus(order.id, "Approved")} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Approve</button>
                  <button onClick={() => updateStatus(order.id, "Declined")} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Decline</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const StatCard = ({ title, value, color }: any) => (
  <div className={`p-6 bg-white border-l-4 border-${color}-500 rounded-lg shadow-sm`}>
    <p className="text-sm text-gray-500 font-medium uppercase">{title}</p>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

const statusStyles: any = {
  Approved: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Declined: "bg-red-100 text-red-700",
};

export default AdminDashboard;