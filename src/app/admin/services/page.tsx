'use client'

import { useAuth } from "../../contexts/AuthContext";
import LoginModal from "../../components/LoginModal";
import RegisterModal from "../../components/RegisterModal";
import ServiceEditModal from "../../components/ServiceEditModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import SearchBar from "../../components/SearchBar";
import { useState, useEffect } from "react";
import { servicesAPI } from "../../services/api";
import { Service } from "../../types";
import { useToast } from "../../contexts/ToastContext";

export default function ListOfService(){
    const { isAdmin, isAuthenticated, isLoading, user, logout } = useAuth();
    const { showToast } = useToast();
    const [services, setServices] = useState<Service[]>([]);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [isLoadingServices, setIsLoadingServices] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    // Fetch services when component mounts and user is admin
    useEffect(() => {
        if (isAdmin) {
            fetchServices();
        }
    }, [isAdmin]);

    const fetchServices = async () => {
        try {
            setError(null);
            setIsLoadingServices(true);
            const servicesData = await servicesAPI.getAll();
            setServices(servicesData);
            setFilteredServices(servicesData);
            showToast('success', 'Services loaded successfully!');
        } catch (error) {
            console.error('Error fetching services:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to load services';
            setError(errorMessage);
            showToast('error', `Failed to load services: ${errorMessage}`);
        } finally {
            setIsLoadingServices(false);
        }
    };

    const handleEditService = (service: Service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedService(null);
    };

    const handleAddService = () => {
        setSelectedService(null); // null indicates create mode
        setIsModalOpen(true);
    };

    const handleServiceUpdate = (serviceId: number, updatedService: Partial<Service>) => {
        if ((updatedService as any).deleted) {
            // Deleting service - remove from the list
            setServices(prevServices => 
                prevServices.filter(service => service.id !== serviceId)
            );
            setFilteredServices(prevServices => 
                prevServices.filter(service => service.id !== serviceId)
            );
            showToast('success', 'Service deleted successfully!');
        } else if (selectedService === null) {
            // Adding new service - add to the list
            const newService = updatedService as Service;
            setServices(prevServices => [...prevServices, newService]);
            setFilteredServices(prevServices => [...prevServices, newService]);
            showToast('success', `Service "${newService.name}" created successfully!`);
        } else {
            // Updating existing service - update in the list
            setServices(prevServices => 
                prevServices.map(service => 
                    service.id === serviceId 
                        ? { ...service, ...updatedService }
                        : service
                )
            );
            setFilteredServices(prevServices => 
                prevServices.map(service => 
                    service.id === serviceId 
                        ? { ...service, ...updatedService }
                        : service
                )
            );
            showToast('success', `Service "${updatedService.name || 'Unknown'}" updated successfully!`);
        }
    };

    // Handle search functionality
    const handleSearch = (searchInput: string) => {
        if (!searchInput.trim()) {
            setFilteredServices(services);
            return;
        }

        const searchTerm = searchInput.toLowerCase();
        const filtered = services.filter(service => 
            service.name.toLowerCase().includes(searchTerm) ||
            service.description.toLowerCase().includes(searchTerm)
        );
        
        setFilteredServices(filtered);
    };

    // Show loading while auth is being determined
    if (isLoading) {
        return (
            <div className="min-h-screen bg-stone-900 py-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-stone-100 text-xl mb-4">Loading...</div>
                </div>
            </div>
        );
    }

    // Show access denied for non-admin users
    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-stone-900 py-20 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <h1 className="text-3xl font-bold text-stone-100 mb-4">Access Denied</h1>
                    <p className="text-stone-300 mb-6">
                        {!isAuthenticated 
                            ? "You need to login as an admin to access this page." 
                            : "You don't have admin privileges to access this page."}
                    </p>
                    
                    {!isAuthenticated && (
                        <button 
                            onClick={() => {
                                const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
                                if (modal) modal.showModal();
                            }}
                            className="btn bg-yellow-950 text-white hover:bg-black px-6 py-2 rounded-lg"
                        >
                            Login as Admin
                        </button>
                    )}
                    
                    {isAuthenticated && (
                        <p className="text-stone-400 text-sm">
                            Contact your administrator if you believe you should have access.
                        </p>
                    )}
                </div>
                
                {/* Include modals for login functionality */}
                <LoginModal />
                <RegisterModal />
            </div>
        );
    }

    // Show loading state for services
    if (isLoadingServices) {
        return (
            <>
                <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-800 border-b border-stone-700 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <img src="/logo.png" alt="Logo" className="w-12 h-8 mr-3" />
                                <span className="text-xl font-semibold text-stone-100">Admin Panel</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-stone-300">Hi, {user?.name}</span>
                                <button
                                    onClick={() => {
                                        logout();
                                        window.location.href = '/';
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="min-h-screen bg-stone-900 pt-28 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </>
        );
    }

    // Show error state
    if (error) {
        return (
            <>
                <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-800 border-b border-stone-700 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <img src="/logo.png" alt="Logo" className="w-12 h-8 mr-3" />
                                <span className="text-xl font-semibold text-stone-100">Admin Panel</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-stone-300">Hi, {user?.name}</span>
                                <button
                                    onClick={() => {
                                        logout();
                                        window.location.href = '/';
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="min-h-screen bg-stone-900 pt-28 flex flex-col items-center justify-center">
                    <div className="text-red-400 text-lg mb-4">⚠️ Error Loading Services</div>
                    <div className="text-stone-300 text-center mb-6 max-w-md">{error}</div>
                    <button 
                        onClick={fetchServices} 
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </>
        );
    }
    return (
        <>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-800 border-b border-stone-700 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="w-12 h-8 mr-3"
                        />
                        <span className="text-xl font-semibold text-stone-100">Admin Panel</span>
                    </div>

                    {/* Admin Info and Logout */}
                    <div className="flex items-center space-x-4">
                        <span className="text-stone-300">Hi, {user?.name}</span>
                        <button
                            onClick={() => {
                                logout();
                                // Optionally redirect to home page after logout
                                window.location.href = '/';
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        <div className="w-full min-h-screen bg-stone-900 pt-28 py-8 space-y-20">
            <div className="w-3/4 bg-stone-800 rounded-lg shadow-lg border border-stone-700 mx-auto">
                <div className="px-6 py-4 border-b border-stone-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="w-1/2 text-lg font-medium text-stone-100">My Service</h3>
                        <div className="flex flex-col w-1/2">
                            <div className="w-full"><SearchBar handleSearch={handleSearch} /></div>
                            <button onClick={handleAddService} className="w-full text-sm text-blue-400 hover:text-stone-100 text-end hover:underline hover:cursor-pointer px-4 rounded-lg transition-colors">Add New Service</button>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-stone-700">
                        <thead className="bg-stone-900">
                        <tr>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider"
                            >
                            Service ID
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider"
                            >
                            Service Name
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider"
                            >
                            Description
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider"
                            >
                            Price
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider"
                            >
                            Duration
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider"
                            >
                            Action
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-stone-800 divide-y divide-stone-700">
                        {filteredServices.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-stone-400">
                                    {services.length === 0 ? 'No services available' : 'No services match your search'}
                                </td>
                            </tr>
                        ) : (
                            filteredServices.map((service: Service) => (
                            <tr
                            key={service.id}
                            className="hover:bg-stone-700 transition-colors"
                            >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                                {service.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-300">
                                {service.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-300 max-w-xs truncate">
                                {service.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-100">
                                Rp {service.price.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-100">
                                {service.durationMinutes} minutes
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-100">
                                <button 
                                    onClick={() => handleEditService(service)}
                                    className="text-blue-400 hover:text-blue-50 hover:underline hover:cursor-pointer transition-colors"
                                >
                                    Edit
                                </button>
                            </td>
                            </tr>
                        )))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Service Edit Modal */}
        <ServiceEditModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            service={selectedService}
            onServiceUpdate={handleServiceUpdate}
        />
        </>
    )
};



