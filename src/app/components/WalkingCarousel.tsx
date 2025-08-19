'use client';

import React from 'react';
import Image from 'next/image';

interface CarouselImage {
  src: string;
  alt: string;
  id: number;
  caption?: string;
}

interface WalkingCarouselProps {
  images?: CarouselImage[];
  speed?: number;
  className?: string;
}

const WalkingCarousel: React.FC<WalkingCarouselProps> = ({ 
  images = [], 
  speed = 20,
  className = ''
}) => {
  // Default sample images if none provided
  const defaultImages: CarouselImage[] = [
    { id: 1, src: '/lift_2.jpeg', alt: 'Sample 1', caption: 'Lash Lift' },
    { id: 2, src: '/cat_eye.jpeg', alt: 'Cat eyelash', caption: 'Cat eye lashes' },
    { id: 3, src: '/volume_2.jpeg', alt: 'Volume Lash', caption: 'Volume Lash' },
    { id: 4, src: '/natural_prem.jpeg', alt: 'Natural Eyelash', caption: 'Natural Premium' },
    { id: 5, src: '/lift_3.jpeg', alt: 'Lash lift', caption: 'Lash Lift' },
    { id: 6, src: '/russian_doll.jpeg', alt: 'Russian Doll', caption: 'Russian Doll' },
    { id: 7, src: '/cat_3.jpeg', alt: 'Cat Eye Lashes', caption: 'Cat Eye Lashes' },
    { id: 8, src: '/volume_3.jpeg', alt: 'Volume Lash', caption: 'Volume Eyelash' },
    { id: 9, src: '/russian_2.jpeg', alt: 'Russian Lash', caption: 'Russian Lash' },
  ];

  const displayImages = images && images.length > 0 ? images : defaultImages;
  // Duplicate images 4 times to ensure seamless infinite loop
  const infiniteImages = [...displayImages, ...displayImages, ...displayImages, ...displayImages];
  const totalWidth = displayImages.length * 155; // 150px width + 5px margin

  return (
    <div className='w-full bg-stone-900 place-items-center'>
        <div className={`w-3/4 overflow-hidden bg-stone-900object-fill py-5 ${className}`}>
            <div 
                className="flex animate-scroll hover:pause"
                style={{
                width: `${totalWidth * 4}px`,
                animationDuration: `${speed}s`,
                }}
            >
                {infiniteImages.map((image, index) => (
                <div
                    key={`${image.id}-${index}`}
                    className="flex-shrink-0 mr-5 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 object-cover flex flex-col w-[150px]"
                >
                    <div className="w-[150px] h-[200px] overflow-hidden">
                        <Image
                        src={image.src}
                        alt={image.alt}
                        width={150}
                        height={200}
                        className="block transition-all duration-300 hover:brightness-110 object-cover w-full h-full"
                        />
                    </div>
                    <div className="bg-white px-2 py-1 text-center">
                        <p className="text-xs font-medium text-gray-700 truncate">
                            {image.caption || image.alt}
                        </p>
                    </div>
                </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default WalkingCarousel;
export type { CarouselImage, WalkingCarouselProps };