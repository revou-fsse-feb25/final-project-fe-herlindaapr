'use client';

import React from 'react';
import Image from 'next/image';

interface CarouselImage {
  src: string;
  alt: string;
  id: number;
  caption?: string;
}

interface WalkingCarouselNailArtProps {
  images?: CarouselImage[];
  speed?: number;
  className?: string;
}

const WalkingCarouselNailArt: React.FC<WalkingCarouselNailArtProps> = ({ 
  images = [], 
  speed = 20,
  className = ''
}) => {
  // Default nail art images
  const defaultNailArtImages: CarouselImage[] = [
    { id: 1, src: '/blue_nails.jpeg', alt: 'Blue Nails', caption: 'Blue Nail Art' },
    { id: 2, src: '/cat_nail_pink.jpeg', alt: 'Cat Eye Nail Art', caption: 'Cat Eye Nail Art' },
    { id: 3, src: '/nail_black.jpeg', alt: 'Black Nail Art', caption: 'Black Nail Art' },
    { id: 4, src: '/cat_nails.jpeg', alt: 'Cat Eye Nail Art', caption: 'Cat Eye Nail Art' },
    { id: 5, src: '/nail_bug.jpeg', alt: 'Bee Nail Art', caption: 'Bee Nail Art' },
    { id: 6, src: '/nail_purple.jpeg', alt: 'Purple Nail Art', caption: 'Purple Nail Art' },
    { id: 7, src: '/pink_cat_nail.jpeg', alt: 'Cat Eye Nail Art', caption: 'Cat Eye Nail Art' },
    { id: 8, src: '/red_nail.jpeg', alt: 'Red Nail Art', caption: 'Red Nail Art' },
    
  ];

  const displayImages = images && images.length > 0 ? images : defaultNailArtImages;
  // Duplicate images 4 times to ensure seamless infinite loop
  const infiniteImages = [...displayImages, ...displayImages, ...displayImages, ...displayImages];
  const totalWidth = displayImages.length * 155; // 150px width + 5px margin

  return (
    <div className='w-full bg-stone-900 place-items-center'>
        <div className={`w-3/4 overflow-hidden bg-stone-900 object-fill py-5 ${className}`}>
            <div 
                className="flex animate-scroll-right hover:pause"
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
                    <div className="bg-stone-100 px-2 py-1 text-center">
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

export default WalkingCarouselNailArt;
export type { CarouselImage, WalkingCarouselNailArtProps };
