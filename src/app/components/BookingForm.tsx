'use client'

import Link from "next/link";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { bookingsAPI, servicesAPI } from "../services/api";
import { timeSlotUtils, BUSINESS_HOURS } from "../types";

interface BookingFormData {
    name: string;
    email: string;
    dateTime: string;
    services: string[];
    notes: string;
}

export default function BookingForm() {
    const { user, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
    const { showToast } = useToast();
    const [serviceOptions, setServiceOptions] = useState<{ value: string; label: string; price: number }[]>([]);
    const [isLoadingServices, setIsLoadingServices] = useState(true);

    const [formData, setFormData] = useState<BookingFormData>({
        name: '',
        email: '',
        dateTime: '',
        services: [],
        notes: ''
    });

    const [serviceSelections, setServiceSelections] = useState<string[]>([]);
    const [serviceSearchTerm, setServiceSearchTerm] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch services from API
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setIsLoadingServices(true);
                const services = await servicesAPI.getAll();

                
                // Transform API data to match our interface
                const transformedServices = Array.isArray(services) ? services.map(service => ({
                    value: service.id || service._id || service.serviceId,
                    label: service.name || service.serviceName || service.title,
                    price: service.price || service.cost || 0
                })) : [];
                
                setServiceOptions(transformedServices);
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setIsLoadingServices(false);
            }
        };

        fetchServices();
    }, []);

    // Auto-fill user data if authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email
            }));
        }
    }, [isAuthenticated, user]);

    function handleAddService(): void {
        setServiceSelections((prev) => [...prev, ""]);
    }

    function handleChangeService(index: number, value: string): void {
        setServiceSelections((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    }

    function handleRemoveService(index: number): void {
        setServiceSelections((prev) => prev.filter((_, i) => i !== index));
    }

    function getFilteredServices() {
        if (!serviceSearchTerm) return serviceOptions;
        
        return serviceOptions.filter(service =>
            service.label.toLowerCase().includes(serviceSearchTerm.toLowerCase())
        );
    }

    const handleInputChange = (field: keyof BookingFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const calculateTotalPrice = () => {
        return serviceSelections
            .filter(service => service !== '')
            .reduce((total, serviceValue) => {
                const service = serviceOptions.find(opt => `${opt.value}` === serviceValue);
                const price = service?.price || 0;
                return total + price;
            }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form first
        if (!formData.name || !formData.email || !formData.dateTime) {
            showToast('error', 'Please fill in all required fields');
            return;
        }

        // Validate date is in the future
        const selectedDate = new Date(formData.dateTime);
        const now = new Date();
        if (selectedDate <= now) {
            showToast('error', 'Please select a future date and time for your appointment');
            return;
        }

        // Validate business hours
        const hours = selectedDate.getHours();
        if (hours < 9 || hours >= 16) {
            showToast('error', `Booking must be between ${BUSINESS_HOURS.openTime} and ${BUSINESS_HOURS.closeTime}`);
            return;
        }

        if (serviceSelections.length === 0 || serviceSelections.every(s => s === '')) {
            showToast('error', 'Please select at least one service');
            return;
        }

        // Check if user is authenticated
        if (!isAuthenticated) {
            openLoginModal();
            return;
        }

        setIsSubmitting(true);

        try {
            const bookingData = {
                bookingDate: formData.dateTime,
                services: serviceSelections.filter(s => s !== ''),
                notes: formData.notes,
            };

            const response = await bookingsAPI.create(bookingData);

            // Verify booking was actually created by checking user's bookings
            try {
                const userBookings = await bookingsAPI.getMyBookings();
                
                // Check if the new booking exists
                const newBookingExists = userBookings.some((booking: any) => 
                    booking.id === response.id || 
                    new Date(booking.bookingDate || booking.appointmentDate || booking.date).getTime() === 
                    new Date(bookingData.bookingDate).getTime()
                );
                
                if (newBookingExists) {
                    showToast('success', 'Booking created successfully! View your bookings in your dashboard.');
                } else {
                    showToast('warning', 'Booking submitted but verification failed. Please check your dashboard.');
                }
            } catch (verifyError) {
                console.error('❌ DEBUG: Failed to verify booking creation:', verifyError);
                showToast('success', 'Booking created successfully! View your bookings in your dashboard.');
            }

            // Reset form
            setFormData({
                name: user?.name || '',
                email: user?.email || '',
                dateTime: '',
                services: [],
                notes: ''
            });
            setServiceSelections([]);

        } catch (error: any) {
            console.error('❌ DEBUG: Booking creation failed:', error);
            console.error('❌ DEBUG: Error details:', {
                message: error.message,
                stack: error.stack,
                response: error.response,
                status: error.status
            });
            
            // Check if it's a network/auth issue
            if (error.message?.includes('Authentication required') || error.message?.includes('401')) {
                showToast('error', 'Session expired. Please login again.');
            } else if (error.message?.includes('Network') || error.message?.includes('fetch')) {
                showToast('error', 'Network error. Please check your connection and try again.');
            } else {
                showToast('error', error.message || 'Failed to create booking. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const openLoginModal = () => {
        const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
        if (modal) modal.showModal();
    };

    return (
        <div className="flex w-full justify-center flex-col items-center">
            <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-3">
            
                {/* name input */}
                <label className="input validator w-full bg-stone-100">
                    <svg className={`h-[1em] ${isAuthenticated ? 'text-stone-100' : 'text-yellow-900'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                        >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                        </g>
                    </svg>
                    <input
                        type="text"
                        required
                        placeholder="Username"
                        pattern="[A-Za-z][A-Za-z0-9\-]*"
                        minLength={4}
                        maxLength={30}
                        title="Only letters, numbers or dash"
                        className="text-yellow-950 placeholder:text-yellow-950/30 disabled:opacity-100 disabled:bg-stone-100 disabled:text-yellow-950"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={isAuthenticated}
                    />
                    </label>
                    <p className="validator-hint w-full">
                    Must be 4 to 30 characters
                    <br />containing only letters, numbers or dash
                    </p>

                {/* email input */}
                <label className="input validator w-full bg-stone-100">
                    <svg className={`h-[1em] ${isAuthenticated ? 'text-stone-100' : 'text-yellow-900'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                        >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </g>
                    </svg>
                    <input 
                        type="email" 
                        placeholder="mail@site.com" 
                        required 
                        className="text-yellow-950 placeholder:text-yellow-950/30 disabled:opacity-100 disabled:bg-stone-100 disabled:text-yellow-950"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={isAuthenticated}
                    />
                </label>
                    <div className="validator-hint w-full invisible min-h-5">Enter valid email address</div>

                {/* date time input */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-stone-800 font-medium">Date & Time</label>
                        <div className="text-xs text-stone-600">
                            Business Hours: {BUSINESS_HOURS.openTime} - {BUSINESS_HOURS.closeTime}
                        </div>
                    </div>
                    <input
                        type="datetime-local"
                        className="input w-full bg-stone-100 text-yellow-950 [&::-webkit-calendar-picker-indicator]:text-yellow-950 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:sepia [&::-webkit-calendar-picker-indicator]:saturate-200 [&::-webkit-calendar-picker-indicator]:hue-rotate-[330deg] [&::-webkit-calendar-picker-indicator]:brightness-90 [&::-webkit-calendar-picker-indicator]:contrast-100"
                        value={formData.dateTime}
                        onChange={(e) => handleInputChange('dateTime', e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        required
                    />
                </div>

                {/* services add button and dynamic list */}
                <div className="mt-2">
                    <div className="flex items-center justify-between">
                        <span className="text-stone-800">Services</span>
                        <button
                            type="button"
                            onClick={handleAddService}
                            className="btn btn-sm btn-outline border-stone-400 text-stone-700 hover:border-stone-600 hover:text-stone-100"
                            aria-label="Add service"
                            disabled={isLoadingServices}
                        >
                            {isLoadingServices ? 'Loading...' : '+ Add'}
                        </button>
                    </div>

                    {/* Single Search Input */}
                    {serviceSelections.length > 0 && (
                        <div className="mt-3">
                            <input
                                type="text"
                                placeholder="Search services by name..."
                                value={serviceSearchTerm}
                                onChange={(e) => setServiceSearchTerm(e.target.value)}
                                className="input input-sm bg-white text-yellow-950 placeholder:text-yellow-950/50 w-full mb-3"
                            />
                            {serviceSearchTerm && (
                                <p className="text-xs text-stone-500 mb-3">
                                    {getFilteredServices().length} service(s) found
                                </p>
                            )}
                        </div>
                    )}

                    {isLoadingServices && (
                        <div className="mt-3 p-3 bg-stone-200 rounded-lg">
                            <p className="text-stone-600 text-sm">Loading services...</p>
                        </div>
                    )}

                    {serviceSelections.length > 0 && (
                        <div className="mt-3">
                            <div className="flex flex-wrap gap-2">
                                {serviceSelections.map((selected, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <select
                                            name="services[]"
                                            value={selected}
                                            onChange={(e) => handleChangeService(index, e.target.value)}
                                            className="select select-bordered select-sm bg-stone-100 text-yellow-950 w-auto min-w-[12rem]"
                                            required
                                        >
                                            <option value="" disabled>
                                                {serviceSearchTerm ? 'Select from filtered results...' : 'Select a service...'}
                                            </option>
                                            {getFilteredServices().map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label} - IDR {Number(opt.price).toLocaleString()}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-sm"
                                            aria-label="Remove service"
                                            onClick={() => handleRemoveService(index)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-stone-500 mt-1">Click "+ Add" to include more services.</p>
                            
                            {/* Total Price Display */}
                            {serviceSelections.some(s => s !== '') && (
                                <div className="mt-3 p-3 bg-stone-200 rounded-lg">
                                    <p className="text-stone-800 font-semibold">
                                        Total: IDR {calculateTotalPrice().toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* notes input */}
                <fieldset className="fieldset w-full">
                    <input 
                        type="text" 
                        className="input bg-stone-100 text-yellow-950 placeholder:text-yellow-950/30 w-full" 
                        placeholder="Leave us a note" 
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                    />
                    <p className="label text-yellow-950/30">*Optional</p>
                </fieldset>



                <button 
                    type="submit"
                    className={`btn btn-neutral join-item ${isAdmin ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-950 hover:bg-black'}`}
                    disabled={isSubmitting || authLoading || isAdmin}
                    title={isAdmin ? 'Admins cannot create bookings' : ''}
                >
                    {isAdmin ? 'Admin Access Only' : isSubmitting ? 'Creating Booking...' : 'Book'}
                </button>
                
                {isAdmin && (
                    <div className="mt-2 text-center">
                        <p className="text-sm text-gray-600">
                            Booking is disabled for admin accounts
                        </p>
                    </div>
                )}
            </form>

            {/* Contact Info */}
            <div className="text-stone-950 w-full md:w-3/4 h-14 flex flex-row border gap-x-2 md:gap-x-10 place-self-center items-center justify-center mt-10 rounded-sm">
                <p className="text-center text-[10px] md:text-sm">© 2025 All Rights Reserved</p>
                <Link href="/faq" className="flex border rounded-full gap-2 p-2 hover:bg-stone-600 hover:text-stone-100 bg-stone-300">
                    <p className="hover:underline">FAQ</p>
                </Link>
                <Link href="https://wa.me/6281390488967?text=Hello%20I%20want%20to%20book%20a%20nail%20art%20session!" className="flex border rounded-full gap-2 p-2 hover:bg-stone-600 bg-green-200">
                    <FaWhatsapp size={20} color="green" />
                </Link>
                <Link href="https://www.instagram.com/herlindaapr" className="flex border rounded-full gap-2 p-2 hover:bg-stone-600 bg-pink-200">
                    <FaInstagram size={20} color="red" />
                </Link>
                <Link href="https://mail.google.com/mail/herlindaapr" className="flex border rounded-full mr-4 gap-2 p-2 hover:bg-stone-600 bg-blue-200">
                    <SiGmail size={20} color="navy"/>
                </Link>
            </div>
        </div>
    );
}