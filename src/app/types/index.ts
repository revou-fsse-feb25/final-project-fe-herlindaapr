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
