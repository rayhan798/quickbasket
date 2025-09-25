'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const sidebarItems = [
  { label: "add-to-product", path: "/admin/add-to-product" },
  { label: "Inventory", path: "/admin/inventory" },
  { label: "Meat Inventory", path: "/admin/meat-inventory" },
  { label: "Sales", path: "/admin/sales" },
  { label: "Sales Report", path: "/admin/sales-report" },
  { label: "Category List", path: "/admin/categories" },
  { label: "Product List", path: "/admin/products" }, // ✅ Updated
  { label: "Expired List", path: "/admin/expired" },
  { label: "Supplier List", path: "/admin/suppliers" },
  { label: "Receiving", path: "/admin/receiving" },
  { label: "Delivery Reports", path: "/admin/deliveries" },
  { label: "Monthly Profit", path: "/admin/profit" },
  { label: "Expenses", path: "/admin/expenses" },
];

export default function Dashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setStats([
      { title: "Suppliers", value: 1, bg: "bg-green-500" },
      { title: "Users/Staff", value: 2, bg: "bg-blue-500" },
      { title: "Products", value: 1, bg: "bg-yellow-500" },
      { title: "Expired Products", value: 0, bg: "bg-red-500" },
    ]);

    setSales([
      { title: "Today's Sales", date: "2025-06-30", value: "৳ 0.00", bg: "bg-orange-500" },
      { title: "Total Sales (June)", date: "June 2025", value: "৳ 100.00", bg: "bg-blue-600" },
    ]);
  }, []);

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: 'Sales (৳)',
        data: [0, 50, 75, 100, 80, 100],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
    ],
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-all">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-4">Inventory System</h2>
        {sidebarItems.map(({ label, path }) => (
          <Link
            href={path}
            key={label}
            className="block px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            {label}
          </Link>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Inventory Management System</h1>
          <button
            onClick={toggleTheme}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Toggle Theme
          </button>
        </div>

        <p className="mb-6">Welcome back <strong>Administrator</strong>!</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className={`rounded-lg p-4 text-white shadow ${stat.bg}`}
            >
              <h4 className="text-md">{stat.title}</h4>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {sales.map((sale) => (
            <div
              key={sale.title}
              className={`rounded-lg p-4 text-white shadow ${sale.bg}`}
            >
              <h4 className="text-lg font-semibold">{sale.title}</h4>
              <p>{sale.date}</p>
              <p className="text-2xl mt-1 font-bold">{sale.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-4">Monthly Sales Chart</h3>
          <Bar data={chartData} />
        </div>
      </main>
    </div>
  );
}
