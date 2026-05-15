'use client';

import { useEffect } from 'react';

const AnimatedBackground = () => {
  useEffect(() => {
    const particlesContainer = document.querySelector('.global-floating-particles');
    if (particlesContainer) {
      particlesContainer.innerHTML = '';

      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;  // NOSONAR
        particle.style.top = `${Math.random() * 100}%`;  // NOSONAR
        particle.style.animationDelay = `${Math.random() * 5}s`;  // NOSONAR
        particle.style.animationDuration = `${3 + Math.random() * 4}s`;  // NOSONAR
        particlesContainer.appendChild(particle);
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="initial-background-color" />
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute rounded-full blur-[80px] top-1/4 left-1/4 w-96 h-96 blob-animate blob-animate-1" />
        <div className="absolute rounded-full blur-[80px] bottom-1/4 right-1/4 w-96 h-96 blob-animate blob-animate-2" />
        <div className="absolute rounded-full blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 blob-animate blob-animate-3" />
      </div>
      <div className="global-floating-particles absolute inset-0 overflow-hidden pointer-events-none z-[1]" />
    </div>
  );
};

export default AnimatedBackground;
