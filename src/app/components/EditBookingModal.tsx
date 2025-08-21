'use client';

import { useState, useEffect } from 'react';
import { servicesAPI, bookingsAPI } from '../services/api';
import { Service, BookingItem } from '../types';

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingItem | null;
  onBookingUpdate: (updatedBooking: BookingItem) => void;
  onBookingDelete?: (bookingId: string) => void;
}

export default function EditBookingModal({ 
  isOpen, 
  onClose, 
  booking, 
  onBookingUpdate,
  onBookingDelete 
}: EditBookingModalProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    services: [''],
    bookingDate: '',
    appointmentTime: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Fetch services when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchServices();
      if (booking) {
        // Initialize form with current booking data
        const bookingDateTime = new Date(booking.date);
        const dateStr = bookingDateTime.toISOString().split('T')[0];
        const timeStr = bookingDateTime.toTimeString().split(' ')[0].substring(0, 5);
        
        const currentServices = booking.services && booking.services.length > 0 
          ? booking.services.map(s => s.id)
          : [''];
          

        
        setFormData({
          services: currentServices,
          bookingDate: dateStr,
          appointmentTime: timeStr
        });
      }
    }
  }, [isOpen, booking]);

  const fetchServices = async () => {
    try {
      setIsLoadingServices(true);
      const servicesData = await servicesAPI.getAll();
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.services.length || formData.services.every(s => s === '')) {
      newErrors.services = 'Please select at least one service';
    }

    if (!formData.bookingDate) {
      newErrors.bookingDate = 'Please select a booking date';
    } else {
      const selectedDate = new Date(formData.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.bookingDate = 'Booking date cannot be in the past';
      }
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Please select an appointment time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!booking || !validateForm()) {
      return;
    }

    try {
      setIsUpdating(true);
      
      // Combine date and time and format as full ISO datetime
      const appointmentDateTime = new Date(`${formData.bookingDate}T${formData.appointmentTime}:00.000Z`);
      
      const updateData = {
        services: formData.services.filter(service => service !== ''), // Remove empty strings
        bookingDate: appointmentDateTime.toISOString()
      };

      await bookingsAPI.userUpdate(booking.id, updateData);

      // Find all selected services and calculate new display
      const selectedServices = formData.services
        .filter(serviceId => serviceId !== '')
        .map(serviceId => services.find(s => s.id.toString() === serviceId))
        .filter(service => service !== undefined);

      const serviceDisplayNames = selectedServices.map(service => service!.name).join(', ');
      const totalAmount = selectedServices.reduce((total, service) => total + service!.price, 0);

      // Create updated services array for the booking
      const updatedServices = selectedServices.map(service => ({
        id: service!.id.toString(),
        name: service!.name,
        price: service!.price,
        quantity: 1
      }));
      
      // Update the booking in parent component
      const updatedBooking: BookingItem = {
        ...booking,
        service: serviceDisplayNames,
        services: updatedServices,
        date: appointmentDateTime.toISOString(),
        amount: `Rp. ${totalAmount.toLocaleString()}`
      };

      onBookingUpdate(updatedBooking);
      onClose();
      alert('Booking updated successfully!');
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!booking) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this booking?');

    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await bookingsAPI.delete(booking.id);
      
      if (onBookingDelete) {
        onBookingDelete(booking.id);
      }
      
      onClose();
      alert('Booking deleted successfully!');
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      services: [''],
      bookingDate: '',
      appointmentTime: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b border-stone-700">
          <h3 className="text-lg font-medium text-stone-100">Edit Booking</h3>
          <button
            onClick={handleClose}
            className="text-stone-400 hover:text-stone-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-sm text-stone-400 mb-4">
            Booking ID: <span className="text-blue-400">{booking.id}</span>
          </div>

          {/* Current Services Display */}
          {booking.services && booking.services.length > 0 && (
            <div className="bg-stone-700 p-3 rounded-md mb-4">
              <h4 className="text-sm font-medium text-stone-300 mb-2">Current Services:</h4>
              <div className="space-y-1">
                {booking.services.map((service, index) => (
                  <div key={index} className="flex justify-between text-xs text-stone-400">
                    <span>{service.name} {service.quantity && service.quantity > 1 ? `(${service.quantity}x)` : ''}</span>
                    <span>Rp. {(service.price * (service.quantity || 1)).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-stone-600 pt-1 mt-2">
                  <div className="flex justify-between text-sm font-medium text-stone-300">
                    <span>Total:</span>
                    <span>{booking.amount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">
              Services *
            </label>
            {isLoadingServices ? (
              <div className="text-stone-400">Loading services...</div>
            ) : (
              <div className="space-y-2">
                {formData.services.map((selectedServiceId, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <select
                      value={selectedServiceId}
                      onChange={(e) => {
                        const newServices = [...formData.services];
                        newServices[index] = e.target.value;
                        setFormData({ ...formData, services: newServices });
                      }}
                      className="flex-1 px-3 py-2 bg-stone-700 border border-stone-600 rounded-md text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id.toString()}>
                          {service.name} - Rp. {service.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                    {formData.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newServices = formData.services.filter((_, i) => i !== index);
                          setFormData({ ...formData, services: newServices });
                        }}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {/* Only show Add Another Service if all current services are selected */}
                {formData.services.every(service => service !== '') && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, services: [...formData.services, ''] });
                    }}
                    className="w-full px-3 py-2 bg-stone-600 text-stone-200 rounded-md hover:bg-stone-500 transition-colors text-sm"
                  >
                    + Add Another Service
                  </button>
                )}
              </div>
            )}
            {errors.services && (
              <p className="text-red-400 text-xs mt-1">{errors.services}</p>
            )}
          </div>

          {/* Booking Date */}
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">
              Booking Date *
            </label>
            <input
              type="date"
              value={formData.bookingDate}
              onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
              className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-md text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.bookingDate && (
              <p className="text-red-400 text-xs mt-1">{errors.bookingDate}</p>
            )}
          </div>

          {/* Appointment Time */}
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">
              Appointment Time *
            </label>
            <input
              type="time"
              value={formData.appointmentTime}
              onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
              className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-md text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.appointmentTime && (
              <p className="text-red-400 text-xs mt-1">{errors.appointmentTime}</p>
            )}
          </div>

          {/* Current Status Info */}
          <div className="bg-stone-700 p-3 rounded-md">
            <div className="text-sm text-stone-300">
              <div className="flex justify-between">
                <span>Current Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isUpdating}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                isDeleting || isUpdating
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-500"
              }`}
            >
              {isDeleting ? 'Deleting...' : 'Delete Booking'}
            </button>
            <button
              type="submit"
              disabled={isUpdating || isDeleting || booking.status === "completed" || booking.status === "cancelled"}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                isUpdating || isDeleting || booking.status === "completed" || booking.status === "cancelled"
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              }`}
            >
              {isUpdating ? 'Updating...' : 'Update Booking'}
            </button>
          </div>

          {(booking.status === "completed" || booking.status === "cancelled") && (
            <p className="text-yellow-400 text-xs text-center">
              Cannot edit {booking.status} bookings
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
