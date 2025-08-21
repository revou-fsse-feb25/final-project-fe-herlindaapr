'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bookingsAPI } from '../services/api';
import SearchBar from "../components/SearchBar";
import EditBookingModal from "../components/EditBookingModal";
import { formatDateTime, BookingItem } from '../types';

export default function UserDashboard(){
    const { user, token, isAuthenticated, isLoading: authLoading } = useAuth();
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<BookingItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);



    // Fetch user's booking history
    useEffect(() => {
        const fetchBookings = async () => {
            if (authLoading) {
                return;
            }
            if (!isAuthenticated) {
                setIsLoading(false);
                setError('Please login to view your bookings');
                return;
            }
            try {
                setIsLoading(true);
                setError(null);
                
                
                // Fetch from API
                const data = await bookingsAPI.getMyBookings();
                
                // Transform API data to match our interface
                const transformedBookings = Array.isArray(data.bookings) ? data.bookings.map((booking: any) => {
                    // Extract all services with their details
                    const services = booking.bookingServices.map((bookingService: any) => ({
                        id: bookingService.service.id?.toString(),
                        name: bookingService.service.name,
                        price: bookingService.service.price,
                        quantity: bookingService.quantity || 1
                    }));

                    // Create display string for service names
                    const serviceDisplayNames = services.map((s: any) => 
                        s.quantity > 1 ? `${s.name} (${s.quantity}x)` : s.name
                    ).join(', ');

                    // Calculate total amount
                    const totalAmount = booking.bookingServices.reduce((acc: number, curr: any) => 
                        acc + (curr.service.price * (curr.quantity || 1)), 0
                    );

                    return {
                        id: booking.id || booking.orderId || booking._id || booking.bookingId,
                        service: serviceDisplayNames,
                        services: services,
                        date: booking.date || booking.bookingDate || booking.createdAt || booking.appointmentDate,
                        status: booking.status || 'Pending',
                        amount: `Rp. ${totalAmount.toLocaleString()}`,
                        customerName: booking.customerName || booking.customer?.name || user?.name,
                        notes: booking.notes || booking.description || booking.additionalNotes
                    };
                }) : [];
                
                setBookings(transformedBookings);
                setFilteredBookings(transformedBookings);
            } catch (err: any) {
                console.error('Error fetching bookings:', err);
                setError('Failed to load booking history. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, [isAuthenticated, authLoading, user]);

    // Handle search functionality
    const handleSearch = (searchInput: string) => {
        
        if (!searchInput.trim()) {
            setFilteredBookings(bookings);
            return;
        }

        const searchTerm = searchInput.toLowerCase();
        const filtered = bookings.filter(booking => 
            booking.service.toLowerCase().includes(searchTerm) ||
            booking.id.toLowerCase().includes(searchTerm) ||
            booking.status.toLowerCase().includes(searchTerm) ||
            booking.date.toLowerCase().includes(searchTerm) ||
            (booking.customerName && booking.customerName.toLowerCase().includes(searchTerm)) ||
            (booking.notes && booking.notes.toLowerCase().includes(searchTerm))
        );
        
        setFilteredBookings(filtered);
    };

    // Handle booking edit
    const handleEditBooking = (booking: BookingItem) => {
        setSelectedBooking(booking);
        setIsEditModalOpen(true);
    };

    // Handle booking update after edit
    const handleBookingUpdate = (updatedBooking: BookingItem) => {
        const updatedBookings = bookings.map(booking =>
            booking.id === updatedBooking.id ? updatedBooking : booking
        );
        setBookings(updatedBookings);
        setFilteredBookings(updatedBookings);
        setSelectedBooking(null);
        setIsEditModalOpen(false);
    };

    // Handle booking deletion
    const handleBookingDelete = (bookingId: string) => {
        const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
        setBookings(updatedBookings);
        setFilteredBookings(updatedBookings);
        setSelectedBooking(null);
        setIsEditModalOpen(false);
    };

    // Handle modal close
    const handleCloseEditModal = () => {
        setSelectedBooking(null);
        setIsEditModalOpen(false);
    };

    // Show loading while auth is being determined
    if (authLoading) {
        return (
            <div className="w-full min-h-screen bg-stone-900 py-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-stone-100 text-xl mb-4">Loading...</div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="w-full min-h-screen bg-stone-900 py-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-stone-100 text-xl mb-4">Please login to view your dashboard</div>
                    <button 
                        onClick={() => {
                            const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
                            if (modal) modal.showModal();
                        }}
                        className="btn btn-primary"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-stone-900 py-20 space-y-20">
            <div className="w-3/4 bg-stone-800 rounded-lg shadow-lg border border-stone-700 mx-auto">
                <div className="px-6 py-4 border-b border-stone-700 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-stone-100">My Booking History</h3>
                </div>
                
                {isLoading && (
                    <div className="p-8 text-center">
                        <div className="text-stone-300">Loading your bookings...</div>
                    </div>
                )}

                {error && !isLoading && (
                    <div className="p-8 text-center">
                        <div className="text-red-400 mb-4">{error}</div>
                    </div>
                )}

                {!isLoading && (
                    <div className="overflow-x-auto">
                        {filteredBookings.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="text-stone-300">No bookings found</div>
                                {bookings.length > 0 && (
                                    <div className="text-stone-500 text-sm mt-2">Try adjusting your search terms</div>
                                )}
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-stone-700">
                                <thead className="bg-stone-900">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider">
                                        Booking ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider">
                                        Service
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider">
                                        Booking Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-stone-800 divide-y divide-stone-700">
                                {filteredBookings.map((booking: BookingItem) => (
                                    <tr key={booking.id} className="hover:bg-stone-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                                            {booking.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-300">
                                            {booking.service}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-300">
                                            {formatDateTime(booking.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                booking.status === "completed"
                                                    ? "bg-green-900 text-green-200"
                                                    : booking.status === "confirmed"
                                                    ? "bg-blue-900 text-blue-200"
                                                    : booking.status === "pending"
                                                    ? "bg-red-900 text-red-200"
                                                    : booking.status === "cancelled"
                                                    ? "bg-gray-900 text-gray-200"
                                                    : "bg-gray-900 text-gray-200"
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-100">
                                            {booking.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-100">
                                            <button
                                                onClick={() => handleEditBooking(booking)}
                                                disabled={booking.status === "completed" || booking.status === "cancelled"}
                                                className={`p-2 rounded-lg ${
                                                    booking.status === "completed" || booking.status === "cancelled"
                                                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                                        : "bg-blue-900 text-blue-100 hover:text-blue-300 hover:underline hover:cursor-pointer"
                                                }`}
                                                title={
                                                    booking.status === "completed" || booking.status === "cancelled"
                                                        ? `Cannot edit ${booking.status} bookings`
                                                        : "Edit booking date and service"
                                                }
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Booking Modal */}
            <EditBookingModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                booking={selectedBooking}
                onBookingUpdate={handleBookingUpdate}
                onBookingDelete={handleBookingDelete}
            />
        </div>
    );
};



