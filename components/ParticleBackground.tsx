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
        fpsLimit: 165,
        interactivity: {
          events: {
            onClick: {
              enable: !isMobile,
              mode: 'push',
            },
            onHover: {
              enable: !isMobile,
              mode: ['grab', 'bubble'],
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            grab: {
              distance: 200,
              links: {
                opacity: 0.8,
              },
            },
            bubble: {
              distance: 250,
              size: 6,
              duration: 2,
              opacity: 0.8,
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
            distance: isMobile ? 120 : 150,
            enable: true,
            opacity: isMobile ? 0.3 : 0.5,
            width: isMobile ? 1 : 1.5,
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
            speed: isMobile ? 1.2 : 1.5,
            straight: false,
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200,
            },
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: isMobile ? 65 : 100,
          },
          opacity: {
            value: isMobile ? 0.4 : 0.6,
            animation: {
              enable: true,
              speed: 1,
              minimumValue: isMobile ? 0.2 : 0.3,
              sync: false,
            },
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: isMobile ? 3 : 4 },
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 0.5,
              sync: false,
            },
          },
        },
        detectRetina: true,
        smooth: true,
        motion: {
          disable: false,
          reduce: {
            factor: 4,
            value: true,
          },
        },
      }}
    />
  );
};

export default ParticleBackground;