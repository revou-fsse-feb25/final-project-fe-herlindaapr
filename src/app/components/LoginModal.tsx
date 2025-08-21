'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginModal() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
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

        try {
            const success = await login(formData.email, formData.password);
            if (success) {
                // Close modal after successful login
                const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
                if (modal) {
                    modal.close();
                }
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const openRegister = () => {
        const login = document.getElementById('my_modal_2') as HTMLDialogElement;
        const reg = document.getElementById('register_modal') as HTMLDialogElement;
        if (login) login.close();
        if (reg) reg.showModal();
    };

    return (
        <>
            <dialog id="my_modal_2" className="modal">
                <div className="modal-box bg-stone-900">
                    <h3 className="font-bold mb-4 text-center text-2xl">Please Login</h3>
                    
                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <form id="loginForm" onSubmit={handleSubmit} className="space-y-4">
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
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            form="loginForm" 
                            className="btn btn-primary w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <div className="mt-4 text-sm text-stone-300">
                        Don't have an account?{' '}
                        <button type="button" onClick={openRegister} className="link link-hover text-blue-400">Create one</button>
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