"use client";

import LoadingSpinner from "./LoadingSpinner";
import BookingDetailsModal from "./BookingDetailsModal";
import { useState, useEffect } from "react";
import Link from "next/link";
import { adminAPI, bookingsAPI, servicesAPI, usersAPI } from "../services/api";
import { DashboardStat, OrderItem, BookingStatus, formatDateTime } from "../types";

export default function AdminDashboard() {

    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStat[]>([]);
    const [recentOrders, setRecentOrders] = useState<OrderItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<OrderItem | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false;

        async function fetchStats(): Promise<DashboardStat[]> {
            try {
                // Fetch data from multiple endpoints
                const [services, users, bookings] = await Promise.all([
                    servicesAPI.getAll(),
                    usersAPI.getAll(),
                    bookingsAPI.getAll()
                ]);

                return [
                    {
                        name: "Total Service",
                        value: services?.length || 0,
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        ),
                    },
                    {
                        name: "Total Users",
                        value: users?.filter((user: any) => user.role === "user")?.length || 0,
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ),
                    },
                    {
                        name: "Total Orders",
                        value: bookings?.length || 0,
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        ),
                    },
                ];
            } catch (error) {
                console.error('Error fetching stats:', error);
                throw error;
            }
        }

        async function fetchRecentOrders(): Promise<OrderItem[]> {
            try {
                const bookings = await bookingsAPI.getAll();
                
                // Transform API data to match OrderItem interface
                return bookings.map((booking: any) => {
                    // Calculate total amount from bookingServices
                    const calculatedAmount = booking.bookingServices?.reduce((total: number, bookingService: any) => {
                        return total + (bookingService.service.price * bookingService.quantity);
                    }, 0) || 0;
                    
                    return {
                        id: booking.id || booking._id || `ORD-${Math.random().toString(36).substr(2, 9)}`,
                        customer: booking.customerName || booking.user?.name || booking.name || 'Unknown Customer',
                        date: booking.appointmentDate || booking.bookingDate || booking.date || new Date().toISOString().split('T')[0],
                        createdDate: booking.createdAt ? new Date(booking.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                        serviceName: booking.serviceName || booking.service?.name || 'Unknown Service',
                        bookingServices: booking.bookingServices || [],
                        status: mapApiStatusToLocal(booking.status || 'pending'),
                        amount: `Rp ${calculatedAmount.toLocaleString()}`,
                        notes: booking.notes
                    };
                }).sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()).slice(0, 10); // Get latest 10 orders
            } catch (error) {
                console.error('Error fetching orders:', error);
                throw error;
            }
        }

        // Helper function to map API status to local status
        function mapApiStatusToLocal(apiStatus: string): BookingStatus {
            const statusMap: { [key: string]: BookingStatus } = {
                'pending': 'pending',
                'confirmed': 'confirmed',
                'completed': 'completed',
                'cancelled': 'cancelled',
                'processing': 'pending',
                'active': 'confirmed',
                'finished': 'completed',
                'done': 'completed'
            };
            
            return statusMap[apiStatus.toLowerCase()] || 'pending';
        }

        async function loadAll() {
            try {
                setError(null); // Clear any previous errors
                const [loadedStats, loadedOrders] = await Promise.all([
                    fetchStats(),
                    fetchRecentOrders(),
                ]);
                if (!isCancelled) {
                    setStats(loadedStats);
                    setRecentOrders(loadedOrders);
                }
            } catch (error) {
                console.error('Error loading dashboard data:', error);
                if (!isCancelled) {
                    setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
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

    const handleViewBooking = (order: OrderItem) => {
        setSelectedBooking(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
    };

    const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
        try {
            // The newStatus is already in the correct API format (pending, confirmed, completed, cancelled)
            // No need to map it since BookingDetailsModal now uses the same format
            
            // Update the status in the local state
            setRecentOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === bookingId 
                        ? { ...order, status: newStatus as BookingStatus }
                        : order
                )
            );
        } catch (error) {
            console.error('Failed to update booking status:', error);
            // You could add a toast notification here for better UX
            alert('Failed to update booking status. Please try again.');
        }
    };

    if (isLoading) {
        return (
        <LoadingSpinner />
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-stone-900 rounded-lg">
                <div className="text-red-400 text-lg mb-4">⚠️ Error Loading Dashboard</div>
                <div className="text-stone-300 text-center mb-6 max-w-md">
                    {error}
                </div>
                <button 
                    onClick={() => window.location.reload()} 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    Retry
                </button>
            </div>
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
                </div>
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-700">
                    <thead className="bg-stone-950">
                    <tr>
                        <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                        Booking ID
                        </th>
                        <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                        Customer Name
                        </th>
                        <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                        Date of Booking
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
                        <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                        Action
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
                            {formatDateTime(order.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === "completed"
                                ? "bg-green-900 text-green-200"
                                : order.status === "confirmed"
                                ? "bg-blue-900 text-blue-200"
                                : order.status === "pending"
                                ? "bg-red-900 text-red-200"
                                : order.status === "cancelled"
                                ? "bg-gray-900 text-gray-200"
                                : "bg-gray-900 text-gray-200"
                            }`}
                            >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-100">
                            {order.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-100">
                            <button 
                                onClick={() => handleViewBooking(order)}
                                className="text-blue-400 hover:text-blue-50 hover:underline hover:cursor-pointer transition-colors"
                            >
                                View
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>

            {/* Booking Details Modal */}
            <BookingDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onStatusUpdate={handleStatusUpdate}
                booking={selectedBooking ? {
                    bookingId: selectedBooking.id,
                    customer: selectedBooking.customer,
                    bookingDate: selectedBooking.date,
                    createdDate: selectedBooking.createdDate,
                    serviceName: selectedBooking.serviceName,
                    bookingServices: selectedBooking.bookingServices || [],
                    status: selectedBooking.status,
                    totalAmount: selectedBooking.amount,
                    notes: selectedBooking.notes
                } : null}
            />
        </div>
    );
    }