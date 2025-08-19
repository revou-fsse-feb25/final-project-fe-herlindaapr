"use client"

import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Hero() {

    const heroLogoRef = useRef<HTMLDivElement>(null);
    const heroImageRef = useRef<HTMLDivElement>(null);
    
    useGSAP(() => {
        // Greetings Logo Animation (plays immediately)
        gsap.to(".opening-animation", {
            x: 520,
            duration: 1.5,
            ease: "power2.out"
        });

        gsap.to(".opening-animation-2", {
            x: -430,
            duration: 1.5,
            ease: "power2.out"
        });

        // Hero Logo Scroll Animation - Move to top left corner
        gsap.to(heroLogoRef.current, {
            x: "-45vw", // Move left (adjust based on your needs)
            y: "-45vh", // Move up (adjust based on your needs)
            scale: 0.3, // Scale down for disappearing effect
            opacity: 0.2, // Fade out slightly
            duration: 1,
            ease: "power2.inOut",
            scrollTrigger: {
            trigger: ".greetings",
            start: "top bottom", // Start when greetings section enters viewport
            end: "top top", // End when greetings section reaches top
            scrub: 1, // Smooth scrubbing animation tied to scroll
            toggleActions: "play none none reverse"
            }
        });
  
             // Alternative: If you want it to completely disappear
       gsap.to(heroLogoRef.current, {
         opacity: 0,
         duration: 0.5,
         ease: "power2.inOut",
         scrollTrigger: {
           trigger: ".greetings",
           start: "top 20%", // When greetings is 20% from top
           end: "top 10%", // When greetings is 10% from top
           scrub: 1,
           toggleActions: "play none none reverse"
         }
       });

       // Hero Image Animation - Move from bottom right corner to current position
       gsap.fromTo(heroImageRef.current, 
         {
           x: "100vw", // Start from right edge of viewport
           y: "100vh", // Start from bottom edge of viewport
           opacity: 0,
           scale: 0.5
         },
         {
           x: 0, // Move to current position
           y: 0, // Move to current position
           opacity: 1,
           scale: 1,
           duration: 1.7,
           ease: "power2.out",
           scrollTrigger: {
             trigger: ".greetings",
             start: "top bottom", // Start when greetings section enters viewport
             end: "top top", // End when greetings section reaches top
             scrub: 1, // Smooth scrubbing animation tied to scroll
             toggleActions: "play none none reverse"
           }
         }
       );

        // Title and Subtitle Animation (triggered by scroll)
        const heroSplit = new SplitText(".title", { type: "chars, words" });
        const paragraphSplit = new SplitText(".subtitle", { type: "lines" });

        gsap.from(heroSplit.chars, {
            opacity: 0,
            yPercent: 100,
            duration: 1,
            ease: "expo.out",
            stagger: 0.06,
            scrollTrigger: {
                trigger: ".greetings",
                start: "top 60%",
                end: "bottom 10%",
                toggleActions: "play none none reverse"
            }
        });

        gsap.from(paragraphSplit.lines, {
            opacity: 0,
            yPercent: 100,
            duration: 1,
            ease: "expo.out",
            stagger: 0.06,
            delay: 1,
            scrollTrigger: {
                trigger: ".greetings",
                start: "top 60%",
                end: "bottom 10%",
                toggleActions: "play none none reverse"
            }
        });

        

    }, []);
    return (
        <>
            <div className="bg-stone-100 hero-logo relative w-full h-screen flex items-center justify-center overflow-hidden" ref={heroLogoRef}>
                <img src={"/hero-left.png"} className="opening-animation w-1/3 absolute left-0"></img>
                <img src={"/hero-right.png"} className="opening-animation-2 w-1/3 absolute right-0"></img>
            </div>
            <div className="greetings bg-stone-100 w-full h-screen flex flex-row">
            <div className="flex h-screen w-1/2 flex-col justify-center px-16 space-y-3 ml-8">
                <h1 className="title text-6xl font-bold text-stone-700">Hello, Gorgeous!</h1>
                <p className="subtitle text-2xl font-semibold text-stone-600">Effortless beauty is just a click away! <br/>
                                                                    At-home nails and eyelashes by certified artists <br/>
                                                                    Relax.. We’ve got your glow-up 💫</p>
            </div>
            <div className="hero-image flex h-max w-1/2 self-center justify-center" ref={heroImageRef}>
                <Image src={"/hero-img.png"} 
                alt="Hero Image"
                width={500}
                height={500} 
                />
            </div>
            </div>
        </>
    )
}