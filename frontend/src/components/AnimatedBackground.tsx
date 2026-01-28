'use client';

import { useEffect } from 'react';
import '../styles/AnimatedBackground.css';

const AnimatedBackground = () => {
  useEffect(() => {
    const particlesContainer = document.querySelector(
      '.global-floating-particles',
    );
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
    <div className="global-bg-wrapper" aria-hidden="true">
      <div className="initial-background-color"/>
      <div className="global-background-elements">
        <div className="global-bg-blob global-bg-blob-1"></div>
        <div className="global-bg-blob global-bg-blob-2"></div>
        <div className="global-bg-blob global-bg-blob-3"></div>
      </div>

      <div className="global-floating-particles"></div>
    </div>
  );
};

export default AnimatedBackground;
