"use client";

import { useState, useEffect } from "react";
import { bookingsAPI } from "../services/api";
import { BookingStatus, OrderItem } from "../types";
import BookingDetailsModal from "./BookingDetailsModal";
import { useToast } from "../contexts/ToastContext";

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  bookings: OrderItem[];
  statusCounts: { [key in BookingStatus]: number };
}

interface AdminBookingCalendarProps {
  onBookingUpdate?: (bookingId: string, newStatus: string) => void;
}

export default function AdminBookingCalendar({ onBookingUpdate }: AdminBookingCalendarProps) {
  const { showToast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [allBookings, setAllBookings] = useState<OrderItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<OrderItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Fetch all bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const bookings = await bookingsAPI.getAll();
        
        // Transform API data to match OrderItem interface
        const transformedBookings = bookings.map((booking: any) => {
          // Calculate amount from bookingServices relationship
          const calculatedAmount = booking.bookingServices?.reduce((total: number, bookingService: any) => {
            const servicePrice = bookingService.service?.price || bookingService.price || 0;
            const quantity = bookingService.quantity || 1;
            return total + (servicePrice * quantity);
          }, 0) || 0;
          
          // Extract and validate the booking date with timezone fix
          const extractBookingDate = (booking: any) => {
            const possibleDates = [
              booking.bookingDate,     // Primary field for appointment date
              booking.appointmentDate,
              booking.date,
              booking.appointment_date,
              booking.booking_date
            ];
            
            for (const dateField of possibleDates) {
              if (dateField) {
                try {
                  const parsedDate = new Date(dateField);
                  if (!isNaN(parsedDate.getTime())) {
                    // Subtract 1 day to fix timezone offset issue
                    const adjustedDate = new Date(parsedDate);
                    adjustedDate.setDate(adjustedDate.getDate() - 1);
                    return adjustedDate.toISOString();
                  }
                } catch (e) {
                  // Invalid date format, continue to next field
                }
              }
            }
            
            // If no valid appointment date, use creation date as fallback
            if (booking.createdAt) {
              const creationDate = new Date(booking.createdAt);
              creationDate.setDate(creationDate.getDate() - 1);
              return creationDate.toISOString();
            }
            
            const fallbackDate = new Date();
            fallbackDate.setDate(fallbackDate.getDate() - 1);
            return fallbackDate.toISOString();
          };

          // Extract customer name from multiple possible sources
          const getCustomerName = (booking: any) => {
            return booking.customerName || 
                   booking.user?.name || 
                   booking.user?.firstName || 
                   booking.name || 
                   booking.userName ||
                   'Unknown Customer';
          };

          // Extract service names from bookingServices relationship
          const getServiceNames = (booking: any) => {
            if (booking.bookingServices && booking.bookingServices.length > 0) {
              return booking.bookingServices
                .map((bs: any) => bs.service?.name || bs.serviceName || 'Unknown Service')
                .join(', ');
            }
            return booking.serviceName || booking.service?.name || 'Unknown Service';
          };

          // Get original date (without adjustment) for modal display
          const getOriginalDate = (booking: any) => {
            const possibleDates = [
              booking.bookingDate,
              booking.appointmentDate,
              booking.date,
              booking.appointment_date,
              booking.booking_date
            ];
            
            for (const dateField of possibleDates) {
              if (dateField) {
                try {
                  const parsedDate = new Date(dateField);
                  if (!isNaN(parsedDate.getTime())) {
                    return parsedDate.toISOString();
                  }
                } catch (e) {
                  // Invalid date format, continue to next field
                }
              }
            }
            
            if (booking.createdAt) {
              return new Date(booking.createdAt).toISOString();
            }
            
            return new Date().toISOString();
          };

          const transformedBooking = {
            id: booking.id || booking._id || `ORD-${Math.random().toString(36).substr(2, 9)}`,
            customer: getCustomerName(booking),
            date: extractBookingDate(booking), // Adjusted date for calendar display
            originalDate: getOriginalDate(booking), // Original date for modal
            createdDate: booking.createdAt ? new Date(booking.createdAt).toISOString() : new Date().toISOString(),
            serviceName: getServiceNames(booking),
            bookingServices: booking.bookingServices || [],
            status: mapApiStatusToLocal(booking.status || 'pending'),
            amount: `Rp ${calculatedAmount.toLocaleString()}`,
            notes: booking.notes || booking.description || ''
          };

          return transformedBooking;
        });
        
        setAllBookings(transformedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        showToast('error', 'Failed to load booking data for calendar. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Helper function to map API status to local status
  const mapApiStatusToLocal = (apiStatus: string): BookingStatus => {
    const statusMap: { [key: string]: BookingStatus } = {
      'pending': 'pending',
      'confirmed': 'confirmed',
      'completed': 'completed',
      'cancelled': 'cancelled',
      'canceled': 'cancelled',     // Handle US spelling
      'processing': 'pending',
      'active': 'confirmed',
      'finished': 'completed',
      'done': 'completed',
      'approved': 'confirmed',     // Additional mapping
      'scheduled': 'confirmed',    // Additional mapping
      'waiting': 'pending',        // Additional mapping
      'rejected': 'cancelled'      // Additional mapping
    };
    
    return statusMap[apiStatus.toLowerCase()] || 'pending';
  };

  // Generate calendar days for current month
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from Sunday of the week containing the first day
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // End on Saturday of the week containing the last day
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const days: CalendarDay[] = [];
    const currentCalendarDate = new Date(startDate);
    
    while (currentCalendarDate <= endDate) {
      const dateString = currentCalendarDate.toISOString().split('T')[0];
      
      // Filter bookings for this date
      const dayBookings = allBookings.filter(booking => {
        const bookingDate = new Date(booking.date).toISOString().split('T')[0];
        return bookingDate === dateString;
      });

      // Count bookings by status
      const statusCounts: { [key in BookingStatus]: number } = {
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0
      };

      dayBookings.forEach(booking => {
        statusCounts[booking.status]++;
      });

      days.push({
        date: new Date(currentCalendarDate),
        isCurrentMonth: currentCalendarDate.getMonth() === month,
        bookings: dayBookings,
        statusCounts
      });
      
      currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
    }
    
    setCalendarDays(days);
  }, [currentDate, allBookings]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (day: CalendarDay) => {
    if (day.bookings.length > 0) {
      setSelectedDate(day.date);
      // For now, open the first booking. You could modify this to show a list
      setSelectedBooking(day.bookings[0]);
      setIsModalOpen(true);
      showToast('info', `Opening booking details for ${day.date.toLocaleDateString()}`);
    } else {
      showToast('info', `No bookings found for ${day.date.toLocaleDateString()}`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
    setSelectedDate(null);
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      // Update local state
      setAllBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus as BookingStatus }
            : booking
        )
      );

      // Call parent callback if provided
      if (onBookingUpdate) {
        onBookingUpdate(bookingId, newStatus);
      }

      // Show success toast
      showToast('success', `Calendar updated! Booking status changed to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
    } catch (error) {
      console.error('Failed to update booking status:', error);
      showToast('error', 'Failed to update booking status in calendar. Please try again.');
    }
  };

  const getDayBackgroundColor = (day: CalendarDay) => {
    if (day.bookings.length === 0) return '';
    
    // Priority: completed > confirmed > pending > cancelled
    if (day.statusCounts.completed > 0) return 'bg-green-900/30 border-green-700';
    if (day.statusCounts.confirmed > 0) return 'bg-blue-900/30 border-blue-700';
    if (day.statusCounts.pending > 0) return 'bg-red-900/30 border-red-700';
    if (day.statusCounts.cancelled > 0) return 'bg-gray-900/30 border-gray-700';
    
    return '';
  };

  const getDayTextColor = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return 'text-stone-500';
    if (day.bookings.length === 0) return 'text-stone-300';
    
    // Make text more visible on colored backgrounds
    if (day.statusCounts.completed > 0) return 'text-green-200';
    if (day.statusCounts.confirmed > 0) return 'text-blue-200';
    if (day.statusCounts.pending > 0) return 'text-red-200';
    if (day.statusCounts.cancelled > 0) return 'text-gray-200';
    
    return 'text-stone-300';
  };

  if (isLoading) {
    return (
      <div className="bg-stone-800 rounded-lg shadow-lg border border-stone-700 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-stone-400">Loading calendar...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-800 rounded-lg shadow-lg border border-stone-700">
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-stone-700">
        <div className="flex justify-between items-center">
          <h3 className="text-sm md:text-lg font-medium text-stone-100">Booking Calendar</h3>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-0 md:p-2 hover:bg-stone-700 rounded-lg transition-colors text-stone-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-sm md:text-xl font-semibold text-stone-100 min-w-[200px] text-center">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-0 md:p-2 hover:bg-stone-700 rounded-lg transition-colors text-stone-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="px-6 py-3 border-b border-stone-700">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-900/30 border border-green-700 rounded mr-2"></div>
            <span className="text-green-200">Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-900/30 border border-blue-700 rounded mr-2"></div>
            <span className="text-blue-200">Confirmed</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-900/30 border border-red-700 rounded mr-2"></div>
            <span className="text-red-200">Pending</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-900/30 border border-gray-700 rounded mr-2"></div>
            <span className="text-gray-200">Cancelled</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-stone-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                relative h-16 p-1 border rounded-lg transition-all duration-200
                ${getDayBackgroundColor(day)}
                ${day.bookings.length > 0 
                  ? 'cursor-pointer hover:opacity-80 hover:scale-105' 
                  : 'border-stone-700'
                }
                ${!day.isCurrentMonth ? 'opacity-50' : ''}
              `}
            >
              <div className={`text-sm font-medium ${getDayTextColor(day)}`}>
                {day.date.getDate()}
              </div>
              
              {/* Booking count indicator */}
              {day.bookings.length > 0 && (
                <div className="absolute bottom-1 right-1">
                  <div className="bg-stone-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {day.bookings.length}
                  </div>
                </div>
              )}

              {/* Status dots for multiple bookings */}
              {day.bookings.length > 1 && (
                <div className="absolute bottom-1 left-1 flex space-x-1">
                  {Object.entries(day.statusCounts).map(([status, count]) => 
                    count > 0 && (
                      <div
                        key={status}
                        className={`w-1.5 h-1.5 rounded-full ${
                          status === 'completed' ? 'bg-green-400' :
                          status === 'confirmed' ? 'bg-blue-400' :
                          status === 'pending' ? 'bg-red-400' :
                          'bg-gray-400'
                        }`}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          ))}
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
          bookingDate: selectedBooking.originalDate || selectedBooking.date, // Use original date for modal
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
