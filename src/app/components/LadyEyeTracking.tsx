'use client';

import React, { useEffect, useRef, useState } from 'react';

interface EyeMovement {
  x: number;
  y: number;
}

interface Config {
  maxEyeMovementX: number;
  maxEyeMovementY: number;
  maxHeadRotation: number;
  maxHeadTranslation: number;
  lookForwardDistance: number;
}

const LadyEyeTracking: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLImageElement>(null);
  const rightEyeRef = useRef<HTMLImageElement>(null);
  
  const [headTransform, setHeadTransform] = useState<string>('translate(0, 0) rotateX(0deg) rotateY(0deg)');
  const [leftEyeTransform, setLeftEyeTransform] = useState<string>('translate(0, 0)');
  const [rightEyeTransform, setRightEyeTransform] = useState<string>('translate(0, 0)');
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState<boolean>(true);

  const config: Config = {
    maxEyeMovementX: 5.8,
    maxEyeMovementY: 2.4,
    maxHeadRotation: 3,
    maxHeadTranslation: 4,
    lookForwardDistance: 80
  };

  const calculateEyeMovement = (
    mouseX: number,
    mouseY: number,
    eyeCenterX: number,
    eyeCenterY: number
  ): EyeMovement => {
    const dx = mouseX - eyeCenterX;
    const dy = mouseY - eyeCenterY;
    // Elliptical clamp so vertical movement is gentler
    const norm = Math.sqrt(
      (dx * dx) / (config.maxEyeMovementX * config.maxEyeMovementX) +
      (dy * dy) / (config.maxEyeMovementY * config.maxEyeMovementY)
    );
    if (norm <= 1) return { x: dx, y: dy };
    const scale = 1 / norm;
    return { x: dx * scale, y: dy * scale };
  };

  const handleMouseMove = (e: MouseEvent): void => {
    setCursorPosition({ x: e.clientX, y: e.clientY });

    if (!containerRef.current || !leftEyeRef.current || !rightEyeRef.current) return;

    // Get container center
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const containerCenterY = containerRect.top + containerRect.height / 2;

    // Calculate distance from mouse to container center
    const dx = e.clientX - containerCenterX;
    const dy = e.clientY - containerCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If mouse is very close to container, eyes look forward
    if (distance < config.lookForwardDistance) {
      setLeftEyeTransform('translate(0, 0)');
      setRightEyeTransform('translate(0, 0)');
      setHeadTransform('translate(0, 0) rotateX(0deg) rotateY(0deg)');
      return;
    }

    // Calculate head movement and rotation
    const headRotationX = Math.max(-config.maxHeadRotation, Math.min(config.maxHeadRotation, 
      (dy / containerRect.height) * config.maxHeadRotation));
    const headRotationY = Math.max(-config.maxHeadRotation, Math.min(config.maxHeadRotation, 
      (dx / containerRect.width) * config.maxHeadRotation));
    
    const headTranslationX = Math.max(-config.maxHeadTranslation, Math.min(config.maxHeadTranslation, 
      (dx / containerRect.width) * config.maxHeadTranslation));
    const headTranslationY = Math.max(-config.maxHeadTranslation, Math.min(config.maxHeadTranslation, 
      (dy / containerRect.height) * config.maxHeadTranslation));

    // Apply head movement
    setHeadTransform(`translate(${headTranslationX}px, ${headTranslationY}px) rotateX(${headRotationX}deg) rotateY(${headRotationY}deg)`);

    // Calculate eye movements
    const leftEyeRect = leftEyeRef.current.getBoundingClientRect();
    const rightEyeRect = rightEyeRef.current.getBoundingClientRect();

    const leftEyeCenterX = leftEyeRect.left + leftEyeRect.width / 2;
    const leftEyeCenterY = leftEyeRect.top + leftEyeRect.height / 2;
    const rightEyeCenterX = rightEyeRect.left + rightEyeRect.width / 2;
    const rightEyeCenterY = rightEyeRect.top + rightEyeRect.height / 2;

    // Calculate eye positions
    const leftEyeMovement = calculateEyeMovement(e.clientX, e.clientY, leftEyeCenterX, leftEyeCenterY);
    const rightEyeMovement = calculateEyeMovement(e.clientX, e.clientY, rightEyeCenterX, rightEyeCenterY);

    // Apply eye movements
    setLeftEyeTransform(`translate(${leftEyeMovement.x}px, ${leftEyeMovement.y}px)`);
    setRightEyeTransform(`translate(${rightEyeMovement.x}px, ${rightEyeMovement.y}px)`);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);

    // Hide demo cursor after 3 seconds
    const timer = setTimeout(() => {
      setShowCursor(false);
    }, 3000);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex items-center justify-center overflow-hidden font-sans">
      {/* Demo cursor */}
      {showCursor && (
        <div 
          className="fixed w-2.5 h-2.5 bg-white pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`
          }}
        />
      )}

      {/* Lady container */}
      <div 
        ref={containerRef}
        className="relative w-80 h-96"
        
      >
        {/* Lady base */}
        <div className="relative w-full h-full bg-white overflow-hidden flex items-center justify-center">
          {/* Lady image container */}
          <div className="w-72 h-80 bg-white relative overflow-hidden">
            {/* Lady base image */}
            <img 
              src="/lady_without_eye.png"
              alt="Lady"
              className="w-full h-full object-cover"
              draggable={false}
            />
            
            {/* Left eye container - positioned over the left eye socket */}
            <div className="absolute w-4 h-4 flex items-center justify-center z-10" 
                 style={{ left: '29%', top: '32%' }}>
              <img 
                ref={leftEyeRef}
                src="/left_eye.png"
                alt="left eye"
                className="transition-transform duration-100 ease-out"
                style={{ transform: leftEyeTransform }}
                draggable={false}
              />
            </div>
            
            {/* Right eye container - positioned over the right eye socket */}
            <div className="absolute w-4 h-4 flex items-center justify-center z-10" 
                 style={{ left: '50%', top: '32%' }}>
              <img 
                ref={rightEyeRef}
                src="/left_eye.png"
                alt="right eye"
                className="transition-transform duration-100 ease-out"
                style={{ transform: rightEyeTransform }}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LadyEyeTracking;