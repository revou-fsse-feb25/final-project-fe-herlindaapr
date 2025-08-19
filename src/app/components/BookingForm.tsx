'use client'

import Link from "next/link";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { useState } from "react";

export default function BookingForm() {
    const serviceOptions: { value: string; label: string }[] = [
        { value: "nail-art", label: "Nail Art" },
        { value: "manicure", label: "Manicure" },
        { value: "pedicure", label: "Pedicure" },
        { value: "eyelash-classic", label: "Eyelash Extension - Classic" },
        { value: "eyelash-volume", label: "Eyelash Extension - Volume" },
        { value: "lash-lift", label: "Lash Lift" },
        { value: "gel-removal", label: "Gel Removal" },
    ];

    const [serviceSelections, setServiceSelections] = useState<string[]>([]);

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
    return (
        <div className="flex w-full justify-center flex-col items-center">
            <form action="" className="w-full max-w-lg space-y-3">
            
                {/* name input */}
                <label className="input validator w-full bg-stone-100">
                    <svg className="h-[1em] text-yellow-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
                        className="text-yellow-950 placeholder:text-yellow-950/30"
                    />
                    </label>
                    <p className="validator-hint w-full">
                    Must be 4 to 30 characters
                    <br />containing only letters, numbers or dash
                    </p>

                {/* email input */}
                <label className="input validator w-full bg-stone-100">
                    <svg className="h-[1em] text-yellow-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
                    <input type="email" placeholder="mail@site.com" required className="text-yellow-950 placeholder:text-yellow-950/30" />
                </label>
                    <div className="validator-hint w-full invisible min-h-5">Enter valid email address</div>

                {/* date time input */}
                <input
                    type="datetime-local"
                    className="input w-full mt-2 bg-stone-100 text-yellow-950 [&::-webkit-calendar-picker-indicator]:text-yellow-950 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:sepia [&::-webkit-calendar-picker-indicator]:saturate-200 [&::-webkit-calendar-picker-indicator]:hue-rotate-[330deg] [&::-webkit-calendar-picker-indicator]:brightness-90 [&::-webkit-calendar-picker-indicator]:contrast-100"
                />

                {/* services add button and dynamic list */}
                <div className="mt-2">
                    <div className="flex items-center justify-between">
                        <span className="text-stone-800">Services</span>
                        <button
                            type="button"
                            onClick={handleAddService}
                            className="btn btn-sm btn-outline border-stone-400 text-stone-700 hover:border-stone-600 hover:text-stone-100"
                            aria-label="Add service"
                        >
                            + Add
                        </button>
                    </div>

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
                                            <option value="" disabled>Select a service...</option>
                                            {serviceOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
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
                        </div>
                    )}
                </div>

                {/* notes input */}
                <fieldset className="fieldset w-full">
                    <input type="text" className="input bg-stone-100 text-yellow-950 placeholder:text-yellow-950/30 w-full" placeholder="Leave us a note" />
                    <p className="label text-yellow-950/30">*Optional</p>
                </fieldset>
                <button className="btn btn-neutral join-item bg-yellow-950 hover:bg-black">Submit</button>
            </form>

            {/* Contact Info */}
            <div className="text-stone-950 w-3/4 h-14 flex flex-row border gap-x-10 place-self-center items-center justify-center mt-10 rounded-sm">
                <p className="text-center text-sm">© 2025 All Rights Reserved</p>
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