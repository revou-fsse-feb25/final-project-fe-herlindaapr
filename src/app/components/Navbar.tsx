'use client';

import Link from 'next/link';
import { useState } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const openLoginModal = () => {
    const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };



  return (
    <div className="fixed nav flex items-center justify-between top-0 z-10 w-80 md:w-full px-4 py-2 bg-stone-100/80 backdrop-blur-md">
      {/* Left side (logo + greeting) */}
      <div className="flex items-center">
        <Link href="/home" className="self-center">
          <img src="/logo.png" alt="Logo Apps" className="w-20 h-11" />
        </Link>
        {user && (
          <div className="hidden md:flex flex-row items-center">
            <span className="text-stone-700 ml-6 font-medium">Hi, {user.name}</span>
            {isAdmin ? (
              <Link
                href="/admin"
                className="font-bold text-stone-700 ml-4 hover:text-yellow-900 hover:cursor-pointer hover:underline transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/user"
                className="font-bold text-stone-700 ml-4 hover:text-yellow-900 hover:cursor-pointer hover:underline transition-colors"
              >
                My Dashboard
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Right side (desktop menu) */}
      <div className="hidden md:flex space-x-4 items-center">
        <Link href="#slide1" className="font-bold text-stone-700">About</Link>
        <Link href="#pricing" className="font-bold text-stone-700">Pricing</Link>
        <Link href="#gallery" className="font-bold text-stone-700">Gallery</Link>
        <Link href="#bookingform" className="font-bold text-stone-700">Booking</Link>

        {user ? (
          <button
            onClick={handleLogout}
            className="font-bold text-stone-700 hover:text-yellow-900 transition-colors"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={openLoginModal}
            className="font-bold text-stone-700 hover:text-yellow-900 transition-colors"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile hamburger button */}
      <div className="md:hidden w-3/4 text-end">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6 text-stone-700" /> : <Menu className="w-6 h-6 text-stone-700" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="absolute top-14 left-0 right-0 bg-stone-100 flex flex-col items-center space-y-4 py-4 shadow-md md:hidden">
          <Link href="#slide1" onClick={() => setIsOpen(false)} className="font-bold text-stone-700">About</Link>
          <Link href="#pricing" onClick={() => setIsOpen(false)} className="font-bold text-stone-700">Pricing</Link>
          <Link href="#gallery" onClick={() => setIsOpen(false)} className="font-bold text-stone-700">Gallery</Link>
          <Link href="#bookingform" onClick={() => setIsOpen(false)} className="font-bold text-stone-700">Booking</Link>

          {user ? (
            <button
              onClick={handleLogout}
              className="font-bold text-stone-700 hover:text-yellow-900 transition-colors"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                openLoginModal();
                setIsOpen(false);
              }}
              className="font-bold text-stone-700 hover:text-yellow-900 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      )}

      <LoginModal />
      <RegisterModal />
    </div>
  );
}
