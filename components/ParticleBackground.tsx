'use client';

import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';

const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container?: any) => {
    // Particles loaded callback
  }, []);

  // Detect if mobile device
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      className="particle-bg"
      options={{
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: !isMobile,
              mode: 'push',
            },
            onHover: {
              enable: !isMobile,
              mode: 'repulse',
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: '#00FF94',
          },
          links: {
            color: '#00FF94',
            distance: isMobile ? 100 : 150,
            enable: true,
            opacity: isMobile ? 0.15 : 0.5,
            width: isMobile ? 0.5 : 1.5,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: false,
            speed: isMobile ? 0.8 : 1.5,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: isMobile ? 40 : 100,
          },
          opacity: {
            value: isMobile ? 0.2 : 0.6,
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: isMobile ? 2 : 4 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticleBackground;