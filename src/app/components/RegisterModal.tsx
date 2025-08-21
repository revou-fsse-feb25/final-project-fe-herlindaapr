'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterModal() {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Basic client-side validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        try {
            const success = await register(formData.name, formData.email, formData.password);
            if (success) {
                // Close modal after successful registration
                const modal = document.getElementById('register_modal') as HTMLDialogElement;
                if (modal) {
                    modal.close();
                }
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const openLogin = () => {
        const reg = document.getElementById('register_modal') as HTMLDialogElement;
        const login = document.getElementById('my_modal_2') as HTMLDialogElement;
        if (reg) reg.close();
        if (login) login.showModal();
    };

    return (
        <>
            <dialog id="register_modal" className="modal">
                <div className="modal-box bg-stone-900">
                    <h3 className="font-bold mb-4 text-center text-2xl">Create Account</h3>

                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <form id="registerForm" onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label htmlFor="name" className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="input input-bordered w-full bg-stone-700"
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label htmlFor="email" className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="input input-bordered w-full bg-stone-700"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label htmlFor="password" className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="input input-bordered w-full bg-stone-700"
                                placeholder="Create a password"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label htmlFor="confirmPassword" className="label">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="input input-bordered w-full bg-stone-700"
                                placeholder="Re-enter your password"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            form="registerForm" 
                            className="btn btn-primary w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Register'}
                        </button>
                    </form>

                    <div className="mt-4 text-sm text-stone-300">
                        Already have an account?{' '}
                        <button type="button" onClick={openLogin} className="link link-hover text-blue-400">Login</button>
                    </div>

                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
}


