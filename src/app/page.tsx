import Image from "next/image";
import CertificateCarousel from "./components/CertificateCarousel";
import Hero from "./components/Hero";
import WalkingCarousel from "./components/WalkingCarousel";
import WalkingCarouselNailArt from "./components/WalkingCarouselNailArt";
import LadyEyeTracking from "./components/LadyEyeTracking";
import BookingForm from "./components/BookingForm";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="w-full">
      <Navbar />
      <main className="w-full h-screen">
        <Hero />

        {/* ABOUT */}
        <section id="slide1" className="bg-stone-900 w-full h-screen flex flex-row relative">
          <div className="flex w-1/2 h-max justify-center place-self-center">
            <CertificateCarousel />
          </div>
          <div className="w-1/2 flex flex-col justify-center">
            <h1 className="text-stone-100 text-4xl py-6">Let's Glow Up!</h1>
            <p className="text-stone-100"> We're a certified home-service beauty artist based in the heart of Yogyakarta, Indonesia <br/>
                Specializing in nail art and eyelash beauty, we're here to bring comfort and confidence to every woman—right at your doorstep <br/>
                We believe that beauty should be accessible, personal, and relaxing. That’s why we offer flexible options: you can choose to use your own items and only pay for service, or let me take care of everything with a complete service package. You can even customize your own personal beauty package to match your style, mood, or special occasion <br/>
                For us, it’s more than just nails or lashes. It’s about making you feel beautiful, pampered, and confident—wherever you are <br/>
                Let’s create your beauty moment, together </p>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="bg-stone-100 w-full max-h-max flex flex-col">
          <div className="w-full flex flex-col mt-8">
            <h1 className="text-center text-stone-700 text-4xl font-extrabold py-6">Pricelist</h1>
            <div className="w-full flex flex-row py-6">
              <div className="w-1/2 flex flex-col justify-center">
                <h2 className="text-stone-600 text-center text-2xl font-bold">Nail Arts</h2>

                {/* NAILS PRICELIST */}
                <ul className="list text-stone-600 mt-6 px-4">
                  <li className="list-row shadow-xs">
                    <div className="list-col-grow">
                      <div className="font-bold">Nail Gel</div>
                      <div className="text-xs">Express manicure, max 2 colours variation, free 2 fingers simple art</div>
                    </div>
                    <div className="font-bold">Rp. 70.000</div>
                  </li>
                  <li className="list-row shadow-xs">
                    <div className="list-col-grow">
                      <div className="font-bold">Nail Gel Halal</div>
                      <div className="text-xs">Express manicure, max 2 colours variation, free 2 fingers simple art</div>
                    </div>
                    <div className="font-bold">Rp. 90.000</div>
                  </li>
                  <li className="list-row shadow-xs">
                    <div className="list-col-grow">
                      <div className="font-bold">Nail Gel Cat Eye</div>
                      <div className="text-xs">Express manicure, max 2 colours variation, free 3 finger arts</div>
                    </div>
                    <div className="font-bold">Rp. 100.000</div>
                  </li>
                  <li className="list-row shadow-xs">
                    <div className="list-col-grow">
                      <div className="font-bold">Nail Gel Cat Eye Halal</div>
                      <div className="text-xs">Express manicure, max 2 colours variation, free 3 finger arts</div>
                    </div>
                    <div className="font-bold">Rp. 130.000</div>
                  </li>
                  <li className="list-row shadow-xs">
                    <div className="list-col-grow">
                      <div className="font-bold">French Nail Gel</div>
                      <div className="text-xs">Express manicure, max 2 colours variation, free 2 fingers simple art</div>
                    </div>
                    <div className="font-bold">Rp. 115.000</div>
                  </li>
                  <li className="list-row shadow-xs">
                    <div className="list-col-grow">
                      <div className="font-bold">French Nail Gel Halal</div>
                      <div className="text-xs">Express manicure, max 2 colours variation, free 2 fingers simple art</div>
                    </div>
                    <div className="font-bold">Rp. 145.000</div>
                  </li>
                </ul>

              </div>
              <span className="border-s border-yellow-900 h-full mt-14"></span>
              <div className="w-1/2 flex flex-col">
                <h2 className="text-stone-600 text-center text-2xl font-bold">Eyelashes</h2>

                {/* EYELASHES PRICELIST */}
                <ul className="list text-stone-600 mt-6 px-4">
                  <li className="list-row shadow-xs">
                    <div className="list-col-grow">
                      <div className="font-bold">Lash Lift Keratin</div>
                      <div className="text-xs">Tint and free spoolie</div>
                    </div>
                    <div className="font-bold">Rp. 99.000</div>
                  </li>
                  <li className="list-row shadow-xs">
                    <div className="list-col-grow">
                      <div className="font-bold">Natural Premium Lash</div>
                      <div className="text-xs">Vitamin and free spoolie</div>
                    </div>
                    <div className="font-bold">Rp. 130.000</div>
                  </li>
                  <li className="list-row shadow-xs">
                    <div className="list-col-grow">
                      <div className="font-bold">Volume Premium Lash</div>
                      <div className="text-xs">Vitamin and free spoolie</div>
                    </div>
                    <div className="font-bold">Rp. 170.000</div>
                  </li>
                  <li className="list-row shadow-xs">
                    <div className="list-col-grow">
                      <div className="font-bold">Cat Eye Lashes</div>
                      <div className="text-xs">Vitamin and free spoolie</div>
                    </div>
                    <div className="font-bold">Rp. 185.000</div>
                  </li>
                  <li className="list-row shadow-xs">
                    <div className="list-col-grow">
                      <div className="font-bold">Russian Doll</div>
                      <div className="text-xs">Vitamin and free spoolie</div>
                    </div>
                    <div className="font-bold">Rp. 210.000</div>
                  </li>
              
                </ul>
              </div>
            </div>
          </div>
          <div className="w-1/2 flex flex-col mb-24">
            <h2 className="text-stone-700 text-center text-xl font-extrabold mt-6 px-4">Adds On</h2>
            <div className="w-full flex flex-col justify-center">
              <ul className="list text-stone-600 mt-6 px-4">
                  <li className="list-row shadow-xs">
                    <div className="list-col-grow font-bold">Nail Art/per-finger</div>
                    <div className="font-bold">Rp. 8.000</div>
                  </li>
                  <li className="list-row shadow-xs">
                    <div className="list-col-grow font-bold">Eye retouch/per-eye</div>
                    <div className="font-bold">Rp. 8.000</div>
                  </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery">
          <div className="w-full h-screen bg-stone-900 pt-10">
            <h1 className="bg-stone-900 text-center text-stone-100 text-4xl font-extrabold py-8">Gallery</h1>
            <WalkingCarousel />
            <WalkingCarouselNailArt />
          </div>
        </section>

        {/* Booking Form */}
        <section id="bookingform">
          <div className="w-full bg-white h-screen pt-14">
            <h1 className="text-center text-yellow-950 text-4xl font-extrabold py-4">Book Yours Now!</h1>
            <div className="w-full h-full flex flex-row bg-white">
              <div className="w-1/2 flex place-content-center">
                <LadyEyeTracking />
              </div>
              <div className="w-1/2 flex place-items-center">
                <BookingForm />
              </div>
            </div>
          </div>
          
        </section>
      </main> 
    </div>
  );
}
