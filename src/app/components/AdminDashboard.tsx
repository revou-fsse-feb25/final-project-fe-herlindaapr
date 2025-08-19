"use client";

import LoadingSpinner from "./LoadingSpinner";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
    interface DashboardStat {
        name: string;
        value: string | number;
        icon: React.ReactNode;
      }
    interface OrderItem {
        id: string;
        customer: string;
        date: string;
        status: "Completed" | "Processing" | "Cancelled";
        amount: string;
    }

    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStat[]>([]);
    const [recentOrders, setRecentOrders] = useState<OrderItem[]>([]);

    useEffect(() => {
        let isCancelled = false;

        async function fetchStats(): Promise<DashboardStat[]> {
            // Replace with real API call
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve([
                        {
                            name: "Total Service",
                            value: 120,
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            ),
                        },
                        {
                            name: "Total Users",
                            value: 2430,
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ),
                        },
                        {
                            name: "Total Orders",
                            value: 342,
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            ),
                        },
                    ]);
                }, 800);
            });
        }

        async function fetchRecentOrders(): Promise<OrderItem[]> {
            // Replace with real API call
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve([
                        { id: "ORD-001", customer: "John Doe", date: "2023-05-20", status: "Completed", amount: "$125.00" },
                        { id: "ORD-002", customer: "Jane Smith", date: "2023-05-19", status: "Processing", amount: "$75.50" },
                        { id: "ORD-003", customer: "Robert Johnson", date: "2023-05-18", status: "Completed", amount: "$220.00" },
                        { id: "ORD-004", customer: "Emily Davis", date: "2023-05-17", status: "Cancelled", amount: "$45.99" },
                        { id: "ORD-005", customer: "Michael Brown", date: "2023-05-16", status: "Completed", amount: "$180.25" },
                    ]);
                }, 1100);
            });
        }

        async function loadAll() {
            try {
                const [loadedStats, loadedOrders] = await Promise.all([
                    fetchStats(),
                    fetchRecentOrders(),
                ]);
                if (!isCancelled) {
                    setStats(loadedStats);
                    setRecentOrders(loadedOrders);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadAll();
        return () => {
            isCancelled = true;
        };
    }, []);
      
    

    if (isLoading) {
        return (
        <LoadingSpinner />
        );
    }

    return (
        <div className="space-y-6 bg-stone-900">
            <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-stone-100">Admin Dashboard</h1>                        
                    <div className="text-sm text-stone-100">Last updated: {new Date().toLocaleDateString()}</div>
            </div>
        {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat) => (
                <div
                    key={stat.name}
                    className="bg-stone-800 rounded-lg shadow-lg p-6 border border-stone-700"
                >
                    <div className="flex items-center">
                    <div className="p-3 rounded-full text-yellow-400 bg-blue-900/30">
                        {stat.icon}
                    </div>
                    <div className="ml-5">
                        {stat.name === "Total Service" ? (
                            <Link href="/admin/services" className="link link-hover text-stone-100 text-sm font-medium">
                                {stat.name}
                            </Link>
                        ) : (
                            <p className="text-sm font-medium text-stone-100">{stat.name}</p>
                        )}
                        <p className="text-2xl font-semibold text-stone-100">{stat.value}</p>
                    </div>
                    </div>
                </div>
                ))}
            </div>

            

            {/* Recent Orders */}
            <div className="bg-stone-800 rounded-lg shadow-lg border border-stone-700">
                <div className="px-6 py-4 border-b border-stone-700 flex justify-between items-center">
                <h3 className="text-lg font-medium text-stone-100">Recent Orders</h3>
                <button className="text-sm text-blue-400 hover:text-blue-300">
                    View all
                </button>
                </div>
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-700">
                    <thead className="bg-stone-950">
                    <tr>
                        <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                        Order ID
                        </th>
                        <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                        Customer
                        </th>
                        <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                        Date
                        </th>
                        <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                        Status
                        </th>
                        <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                        Amount
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-stone-800 divide-y divide-stone-700">
                    {recentOrders.map((order) => (
                        <tr
                        key={order.id}
                        className="hover:bg-stone-700 transition-colors"
                        >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                            {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === "Completed"
                                ? "bg-green-900 text-green-200"
                                : order.status === "Processing"
                                ? "bg-yellow-900 text-yellow-200"
                                : "bg-red-900 text-red-200"
                            }`}
                            >
                            {order.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-100">
                            {order.amount}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
    }