// User Types
export interface User {
  id: number;
  name: string;
  email: string;
}

// Service Types
export interface Service {
  id: number;
  adminId: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
}

// Booking Service Types
export interface BookingService {
  id: number;
  bookingId: number;
  serviceId: number;
  quantity: number;
  service: Service;
}

// Booking Types
export interface Booking {
  id: number;
  userId: number;
  bookingDate: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string;
  handledByAdminId: number | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  handledByAdmin: User | null;
  bookingServices: BookingService[];
}

// Dashboard Types
export interface DashboardStat {
  name: string;
  value: string | number;
  icon: React.ReactNode;
}

export interface OrderItem {
  id: string;
  customer: string;
  date: string;
  originalDate?: string; // Original date from database (for modal display)
  createdDate: string;
  serviceName: string;
  bookingServices?: BookingService[];
  status: "pending" | "confirmed" | "completed" | "cancelled";
  amount: string;
  notes?: string;
}

// Modal Types
export interface BookingDetails {
  bookingId: string;
  customer: string;
  bookingDate: string;
  createdDate: string;
  serviceName: string;
  bookingServices: BookingService[];
  status: "pending" | "confirmed" | "completed" | "cancelled";
  totalAmount: string;
  notes?: string;
}

export interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDetails | null;
  onStatusUpdate?: (bookingId: string, newStatus: string) => void;
}

// Auth Types
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User Dashboard Booking Item
export interface BookingItem {
  id: string;
  service: string; // Display string for table (e.g., "Service 1, Service 2")
  services: Array<{
    id: string;
    name: string;
    price: number;
    quantity?: number;
  }>; // Full service details for editing
  date: string;
  status: "completed" | "confirmed" | "cancelled" | "pending";
  amount: string;
  customerName?: string;
  notes?: string;
}

// Service Edit Modal Types
export interface ServiceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onServiceUpdate?: (serviceId: number, updatedService: Partial<Service>) => void;
}

export interface ServiceFormData {
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export interface ServiceFormErrors {
  name?: string;
  description?: string;
  price?: string;
  durationMinutes?: string;
}

// Status Types
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type UserRole = "admin" | "user";

// Toast Types
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface ToastContextType {
  toasts: Toast[];
  showToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

// Time Slot and Booking Conflict Types
export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
}

export interface BookingConflict {
  conflictingBookingId: string;
  conflictingBookingDate: string;
  conflictingServices: string[];
  message: string;
}

export interface TimeSlotValidationResult {
  isValid: boolean;
  conflicts?: BookingConflict[];
  message?: string;
}

export interface BusinessHours {
  openTime: string; // "09:00"
  closeTime: string; // "16:00"
  bufferMinutes: number; // 120 (2 hours)
}

// Utility Functions
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Format time as HH.MM
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const time = `${hours}.${minutes}`;
  
  // Format date as DD/MM/YYYY
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const dateFormatted = `${day}/${month}/${year}`;
  
  return `${time} ${dateFormatted}`;
};

// Business Hours Configuration
export const BUSINESS_HOURS: BusinessHours = {
  openTime: "09:00",
  closeTime: "16:00", 
  bufferMinutes: 120 // 2 hours buffer between bookings
};

// Notes Parsing Utility
export const parseBookingNotes = (notes: string) => {
  if (!notes) return { userNotes: '', systemNotes: [] };
  
  // Split notes by lines and separate system messages from user notes
  const lines = notes.split('\n').filter(line => line.trim());
  const systemNotes: string[] = [];
  const userNotes: string[] = [];
  
  lines.forEach(line => {
    if (line.trim().startsWith('System: Rescheduled from')) {
      // Parse and format the reschedule message
      const match = line.match(/System: Rescheduled from (.+?) to (.+?)$/);
      if (match) {
        const fromDate = new Date(match[1]);
        const toDate = new Date(match[2]);
        
        // Format dates as HH:MM DD/MM/YYYY
        const formatDate = (date: Date) => {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          return `${hours}:${minutes} ${day}/${month}/${year}`;
        };
        
        systemNotes.push(`System: Rescheduled from ${formatDate(fromDate)} to ${formatDate(toDate)}`);
      } else {
        systemNotes.push(line);
      }
    } else if (line.trim().startsWith('System:')) {
      systemNotes.push(line);
    } else {
      userNotes.push(line);
    }
  });
  
  return {
    userNotes: userNotes.join('\n').trim(),
    systemNotes
  };
};

// Time Slot Validation Utilities
export const timeSlotUtils = {
  // Check if time is within business hours
  isWithinBusinessHours: (dateTime: Date): boolean => {
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    return timeString >= BUSINESS_HOURS.openTime && timeString <= BUSINESS_HOURS.closeTime;
  },

  // Calculate total duration for selected services
  calculateTotalDuration: (services: Service[]): number => {
    return services.reduce((total, service) => total + service.durationMinutes, 0);
  },

  // Create time slot from booking date and services
  createTimeSlot: (bookingDate: Date, services: Service[]): TimeSlot => {
    const duration = timeSlotUtils.calculateTotalDuration(services);
    const endTime = new Date(bookingDate.getTime() + duration * 60000); // Convert minutes to milliseconds
    
    return {
      startTime: bookingDate,
      endTime: endTime,
      duration: duration
    };
  },

  // Check if two time slots overlap (with buffer)
  doTimeSlotsOverlap: (slot1: TimeSlot, slot2: TimeSlot, bufferMinutes: number = BUSINESS_HOURS.bufferMinutes): boolean => {
    // Add buffer time to both slots
    const slot1Start = new Date(slot1.startTime.getTime() - bufferMinutes * 60000);
    const slot1End = new Date(slot1.endTime.getTime() + bufferMinutes * 60000);
    const slot2Start = new Date(slot2.startTime.getTime() - bufferMinutes * 60000);
    const slot2End = new Date(slot2.endTime.getTime() + bufferMinutes * 60000);

    // Check for overlap
    return slot1Start < slot2End && slot2Start < slot1End;
  },

  // Validate booking time against business hours
  validateBusinessHours: (bookingDate: Date, services: Service[]): TimeSlotValidationResult => {
    const timeSlot = timeSlotUtils.createTimeSlot(bookingDate, services);
    
    // Check start time
    if (!timeSlotUtils.isWithinBusinessHours(timeSlot.startTime)) {
      return {
        isValid: false,
        message: `Booking must start between ${BUSINESS_HOURS.openTime} and ${BUSINESS_HOURS.closeTime}`
      };
    }

    // Check end time
    if (!timeSlotUtils.isWithinBusinessHours(timeSlot.endTime)) {
      return {
        isValid: false,
        message: `Booking would end after business hours (${BUSINESS_HOURS.closeTime}). Please select an earlier time or fewer services.`
      };
    }

    return { isValid: true };
  },

  // Format time for display
  formatTimeSlot: (timeSlot: TimeSlot): string => {
    const startTime = timeSlot.startTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    const endTime = timeSlot.endTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    const duration = Math.round(timeSlot.duration);
    
    return `${startTime} - ${endTime} (${duration} minutes)`;
  }
};
