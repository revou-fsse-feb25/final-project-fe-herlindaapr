"use client";

import { useEffect, useState } from "react";
import { bookingsAPI } from "../services/api";
import { BookingDetails, BookingDetailsModalProps, formatDateTime } from "../types";

export default function BookingDetailsModal({ isOpen, onClose, booking, onStatusUpdate }: BookingDetailsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [statusNotes, setStatusNotes] = useState<string>("");
  const [showNotesInput, setShowNotesInput] = useState<string | null>(null);
  // Update current status when booking changes
  useEffect(() => {
    if (booking) {
      setCurrentStatus(booking.status);
    }
  }, [booking]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleStatusUpdate = async (newStatus: string, notes?: string) => {
    if (!booking) return;
    
    setIsUpdating(true);
    try {
      await bookingsAPI.updateStatus(booking.bookingId, newStatus, notes);
      setCurrentStatus(newStatus);
      setShowNotesInput(null);
      setStatusNotes("");
      
      // Call the callback to update parent component
      if (onStatusUpdate) {
        onStatusUpdate(booking.bookingId, newStatus);
      }
      
    } catch (error) {
      console.error('Failed to update status:', error);
      // You could add error handling UI here
      alert('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusButtonClick = (newStatus: string) => {
    // Show notes input for this status
    setShowNotesInput(newStatus);
    setStatusNotes("");
  };

  const handleSubmitStatusChange = () => {
    if (!showNotesInput) return;
    
    // Proceed with update
    handleStatusUpdate(showNotesInput, statusNotes.trim() || undefined);
  };

  const handleCancelStatusChange = () => {
    setShowNotesInput(null);
    setStatusNotes("");
  };

  if (!isOpen || !booking) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-900 text-green-200";
      case "confirmed":
        return "bg-blue-900 text-blue-200";
      case "pending":
        return "bg-red-900 text-red-200";
      case "cancelled":
        return "bg-gray-900 text-gray-200";
      default:
        return "bg-gray-900 text-gray-200";
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "confirmed":
        return "Confirmed";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-stone-800 rounded-lg shadow-xl max-w-md w-full border border-stone-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-stone-700">
            <h3 className="text-lg font-semibold text-stone-100">
              Booking Details
            </h3>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Booking ID */}
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Booking ID
                </label>
                <p className="text-blue-400 font-medium">{booking.bookingId}</p>
              </div>

              {/* Customer */}
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Customer
                </label>
                <p className="text-stone-100">{booking.customer}</p>
              </div>

              {/* Booking Date */}
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Date of Booking
                </label>
                <p className="text-stone-100">{formatDateTime(booking.bookingDate)}</p>
              </div>

              {/* Created Date */}
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Order Created Date
                </label>
                <p className="text-stone-100">{formatDateTime(booking.createdDate)}</p>
              </div>

              {/* Services */}
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Services
                </label>
                <div className="space-y-2">
                  {booking.bookingServices.map((bookingService, index) => (
                    <div key={bookingService.id} className="flex justify-between items-center p-2 bg-stone-700/30 rounded-md">
                      <div>
                        <p className="text-stone-100 font-medium">{bookingService.service.name}</p>
                        <p className="text-stone-400 text-sm">{bookingService.service.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-stone-100">Qty: {bookingService.quantity}</p>
                        <p className="text-stone-300 text-sm">Rp {bookingService.service.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Status
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(currentStatus)}`}>
                      {getStatusDisplayName(currentStatus)}
                    </span>
                    {(currentStatus === "pending" || currentStatus === "confirmed") && !showNotesInput && (
                      <div className="flex gap-2">
                        {currentStatus === "pending" && (
                          <button
                            onClick={() => handleStatusButtonClick("confirmed")}
                            disabled={isUpdating}
                            className="px-3 py-1 text-xs font-medium text-blue-200 bg-blue-900 hover:bg-blue-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Confirm
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusButtonClick("completed")}
                          disabled={isUpdating}
                          className="px-3 py-1 text-xs font-medium text-green-200 bg-green-900 hover:bg-green-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleStatusButtonClick("cancelled")}
                          disabled={isUpdating}
                          className="px-3 py-1 text-xs font-medium bg-gray-900 text-gray-200 hover:bg-gray-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Notes Input */}
                  {showNotesInput && (
                    <div className="space-y-3 p-4 bg-stone-700/50 rounded-lg border border-stone-600">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-stone-200">
                          Update Status to: <span className="text-blue-400 capitalize">{showNotesInput}</span>
                        </h4>
                        <button
                          onClick={handleCancelStatusChange}
                          className="text-stone-400 hover:text-stone-200 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-stone-300 mb-2">
                          Notes (optional)
                        </label>
                        <textarea
                          value={statusNotes}
                          onChange={(e) => setStatusNotes(e.target.value)}
                          placeholder={`Add notes for ${showNotesInput} status...`}
                          className="w-full px-3 py-2 text-sm bg-stone-800 border border-stone-600 rounded-md text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={handleCancelStatusChange}
                          disabled={isUpdating}
                          className="px-4 py-2 text-sm font-medium text-stone-300 bg-stone-600 hover:bg-stone-500 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitStatusChange}
                          disabled={isUpdating}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            showNotesInput === "confirmed" 
                              ? "text-blue-200 bg-blue-900 hover:bg-blue-800"
                              : showNotesInput === "completed"
                              ? "text-green-200 bg-green-900 hover:bg-green-800"  
                              : showNotesInput === "cancelled"
                              ? "text-red-200 bg-red-900 hover:bg-red-800"
                              : "text-stone-200 bg-stone-700 hover:bg-stone-600"
                          }`}
                        >
                          {isUpdating ? "Updating..." : `Update to ${showNotesInput.charAt(0).toUpperCase() + showNotesInput.slice(1)}`}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes Display */}
              {booking.notes && (
                <div>
                  <label className="block text-sm font-medium text-stone-300 mb-1">
                    Notes
                  </label>
                  <p className="text-stone-100 text-sm bg-stone-700 rounded-md p-3 border border-stone-600">
                    {booking.notes}
                  </p>
                </div>
              )}

              {/* Total Amount */}
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">
                  Total Amount
                </label>
                <p className="text-stone-100 font-semibold text-lg">
                  Rp {booking.bookingServices?.reduce((total, bookingService) => {
                    return total + (bookingService.service.price * bookingService.quantity);
                  }, 0).toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
