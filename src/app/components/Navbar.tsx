'use client';

import gsap from 'gsap';
import Link from 'next/link';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { useAuth } from '../contexts/AuthContext';
import { useGSAP } from '@gsap/react';

export default function Navbar() {
    const { user, isAdmin, logout } = useAuth();
    
    const openLoginModal = () => {
        const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
        if (modal) {
            modal.showModal();
        }
    };

    const handleLogout = () => {
        logout();
    };

    useGSAP(() => {
        const NavTween= gsap.timeline({
          scrollTrigger: {
            trigger: '.nav',
            start: 'bottom top'
          }
        });

        NavTween.fromTo('.nav', {backgroundColor: 'transparent'}, {
          backgroundColor: '#f5f5f4cc',
          backgroundFilter: 'blur(10px)',
          duration: 1,
          ease: 'power1.inOut'
        });
    })

    return (
    <div className="fixed nav flex flex-row items-center top-0 z-10 bg-stone-100 w-full max-h-max px-4 py-1">
        <div className="flex items-center w-1/3">
          <Link href="/home" className="self-center">
            <img
              src="/logo.png"
              alt="Logo Apps"
              className="w-20 h-11"
            />
          </Link>
          {user && (
            <div className="flex flex-row items-center">
              <span className="text-stone-700 ml-10 font-medium">Hi, {user.name}</span>
              {isAdmin ? (
                <Link href="/admin" className="font-bold text-stone-700 ml-4 hover:text-yellow-900 hover:cursor-pointer hover:underline transition-colors">Dashboard</Link>
              ) : (
                <Link href="/user" className="font-bold text-stone-700 ml-4 hover:text-yellow-900 hover:cursor-pointer hover:underline transition-colors">My Dashboard</Link>
              )}
            </div>
          )}
        </div>
        <div className="flex w-2/3 justify-end items-center">
          <Link href="#slide1" className="font-bold text-stone-700 ml-4">About</Link>
          <Link href="#pricing" className="font-bold text-stone-700 ml-4">Pricing</Link>
          <Link href="#gallery" className="font-bold text-stone-700 ml-4">Gallery</Link>
          <Link href="#bookingform" className="font-bold text-stone-700 ml-4">Booking</Link>
          
          {user ? (
            <button 
              onClick={handleLogout} 
              className="font-bold text-stone-700 ml-4 hover:text-yellow-900 hover:cursor-pointer transition-colors"
            >
              Logout
            </button>
          ) : (
            <button 
              onClick={openLoginModal} 
              className="font-bold text-stone-700 ml-4 hover:text-yellow-900 hover:cursor-pointer transition-colors"
            >
              Login
            </button>
          )}
        </div>
        <LoginModal />
        <RegisterModal />
    </div>
    )}
