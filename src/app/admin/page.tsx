'use client';

import AdminDashboard from "../components/AdminDashboard";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";

export default function AdminPage() {
    const { isAdmin, isAuthenticated, isLoading, user, logout } = useAuth();
    

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
                    <div className="text-red-400 text-6xl mb-6">🚫</div>
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

    // Show admin dashboard for admin users
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
        <div className="min-h-screen bg-stone-900 pt-16">
            <div className="py-8">
                <div className="max-w-7xl mx-auto">
                    <AdminDashboard />
                </div>
            </div>
        </div>
        </>
    );
}