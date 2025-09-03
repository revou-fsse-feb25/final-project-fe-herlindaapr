"use client"

import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroLogoRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        let { isDesktop, isMobile } = context.conditions!;

        /** Opening logo animation (same for all) */
        gsap.to(".opening-animation", {
          x: isDesktop ? 520 : 97,
          duration: 1.5,
          ease: "power2.out",
        });

        gsap.to(".opening-animation-2", {
          x: isDesktop ? -430 : -97,
          duration: 1.5,
          ease: "power2.out",
        });

        /** Hero logo scroll animation */
        gsap.to(heroLogoRef.current, {
          x: isDesktop ? "-45vw" : "-10vw",
          y: isDesktop ? "-45vh" : "-10vh",
          scale: isDesktop ? 0.3 : 0.5,
          opacity: 0.2,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".greetings",
            start: "top bottom",
            end: "top top",
            scrub: 1,
            toggleActions: "play none none reverse",
          },
        });

        gsap.to(heroLogoRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".greetings",
            start: "top 20%",
            end: "top 10%",
            scrub: 1,
            toggleActions: "play none none reverse",
          },
        });

        /** Hero image animation */
        gsap.fromTo(
          heroImageRef.current,
          {
            x: "100vw",
            y: "100vh",
            opacity: 0,
            scale: 0.5,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".greetings",
              start: "top bottom",
              end: "top top",
              scrub: 1,
              toggleActions: "play none none reverse",
            },
          }
        );

        /** Title + subtitle animation */
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
            start: "top 70%",
            end: "bottom 10%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.from(paragraphSplit.lines, {
          opacity: 0,
          yPercent: 100,
          duration: 1,
          ease: "expo.out",
          stagger: 0.06,
          delay: 0.5,
          scrollTrigger: {
            trigger: ".greetings",
            start: "top 70%",
            end: "bottom 10%",
            toggleActions: "play none none reverse",
          },
        });
      }
    );
  }, []);

  return (
    <>
      <div
        className="bg-stone-100 hero-logo relative w-full h-screen flex items-center justify-center overflow-hidden"
        ref={heroLogoRef}
      >
        <img
          src={"/hero-left.png"}
          className="opening-animation w-1/2 md:w-1/3 absolute left-0"
        ></img>
        <img
          src={"/hero-right.png"}
          className="opening-animation-2 w-1/2 md:w-1/3 absolute right-0"
        ></img>
      </div>
      <div className="greetings bg-stone-100 w-full h-screen flex flex-col md:flex-row">
        <div className="flex h-1/2 md:h-screen w-full md:w-1/2 flex-col justify-center px-6 md:px-16 space-y-3">
          <h1 className="title text-3xl md:text-6xl font-bold text-stone-700">
            Hello, Gorgeous!
          </h1>
          <p className="subtitle text-lg md:text-2xl font-semibold text-stone-600">
            Effortless beauty is just a click away! <br />
            At-home nails and eyelashes by certified artists <br />
            Relax.. We’ve got your glow-up 💫
          </p>
        </div>
        <div
          className="hero-image flex h-1/3 md:h-max w-5/6 md:w-1/2 self-center justify-center"
          ref={heroImageRef}
        >
          <Image src={"/hero-img.png"} alt="Hero Image" width={300} height={300} className="md:w-[500px] md:h-[500px]" />
        </div>
      </div>
    </>
  );
}
