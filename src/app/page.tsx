
'use client';

import CertificateCarousel from "./components/CertificateCarousel";
import Hero from "./components/Hero";
import WalkingCarousel from "./components/WalkingCarousel";
import WalkingCarouselNailArt from "./components/WalkingCarouselNailArt";
import LadyEyeTracking from "./components/LadyEyeTracking";
import BookingForm from "./components/BookingForm";
import Navbar from "./components/Navbar";
import Pricelist from "./components/Pricelist";

export default function Home() {
  return (
    <div className="w-full">
      <Navbar />
      <main className="w-full h-screen">
        <Hero />

        {/* ABOUT */}
        <section id="slide1" className="bg-stone-900 w-full h-screen flex flex-col md:flex-row relative place-content-center">
          <div className="flex w-full md:w-1/2 h-max justify-center place-self-center">
            <CertificateCarousel />
          </div>
          <div className="w-5/6 md:w-1/2 flex flex-col place-self-center justify-center">
            <h1 className="text-stone-100 text-4xl py-6 text-center md:text-start">Let's Glow Up!</h1>
            <p className="text-stone-100"> We're a certified home-service beauty artist based in the heart of Yogyakarta, Indonesia <br/>
                Specializing in nail art and eyelash beauty, we're here to bring comfort and confidence to every woman—right at your doorstep <br/>
                We believe that beauty should be accessible, personal, and relaxing. That’s why we offer flexible options: you can choose to use your own items and only pay for service, or let me take care of everything with a complete service package. You can even customize your own personal beauty package to match your style, mood, or special occasion <br/>
                For us, it’s more than just nails or lashes. It’s about making you feel beautiful, pampered, and confident—wherever you are <br/>
                Let’s create your beauty moment, together </p>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="bg-stone-100 w-full min-h-max md:h-screen flex flex-col">
          <div className="w-full flex flex-col mt-16">
            <h1 className="text-center text-stone-700 text-4xl font-extrabold py-6">Pricelist</h1>
            <div className="w-full flex flex-col md:flex-row py-6 mb-20 md:mb-0">
              <Pricelist />
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery">
          <div className="w-full h-screen bg-stone-900 pt-10 place-content-center">
            <h1 className="bg-stone-900 text-center text-stone-100 text-4xl font-extrabold py-8">Gallery</h1>
            <WalkingCarousel />
            <WalkingCarouselNailArt />
          </div>
        </section>

        {/* Booking Form */}
        <section id="bookingform">
          <div className="w-full bg-white h-svh pt-14">
            <h1 className="text-center text-yellow-950 text-4xl font-extrabold py-4">Book Yours Now!</h1>
            <div className="w-full h-full flex flex-col md:flex-row bg-white place-items-center">
              <div className="w-5/6 md:w-1/2 flex place-content-center">
                <LadyEyeTracking />
              </div>
              <div className="w-5/6 md:w-1/2 flex place-items-center">
                <BookingForm />
              </div>
            </div>
          </div>
          
        </section>
      </main> 
    </div>
  );
}
