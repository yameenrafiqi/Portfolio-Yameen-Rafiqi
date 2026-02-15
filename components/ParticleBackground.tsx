'use client';

import { useCallback, useEffect, useState } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine, Container } from 'tsparticles-engine';

const ParticleBackground = () => {
  const [particleDirection, setParticleDirection] = useState({ x: 0, y: 0 });
  const [container, setContainer] = useState<Container | undefined>();
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  useEffect(() => {
    // Check if device supports orientation and is mobile/tablet
    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 1024;
    
    if (!isMobileDevice || typeof window === 'undefined') return;

    // Check if iOS 13+ requires permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      setShowPermissionPrompt(true);
    } else {
      // Auto-start for non-iOS devices
      startOrientationTracking();
    }
  }, []);

  const startOrientationTracking = () => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // beta: front-to-back tilt (-180 to 180)
      // gamma: left-to-right tilt (-90 to 90)
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;

      // Convert orientation to particle direction
      // Normalize values to -1 to 1 range
      const x = Math.max(-1, Math.min(1, gamma / 30));
      const y = Math.max(-1, Math.min(1, beta / 30));

      setParticleDirection({ x, y });

      // Update particles gravity direction based on tilt
      if (container?.options?.particles?.move?.gravity) {
        // Reverse x for natural tilt feeling
        container.options.particles.move.gravity.maxSpeed = 5;
        container.options.particles.move.gravity.acceleration = Math.abs(x * 2) || Math.abs(y * 2) || 0.5;
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  };

  const requestOrientationPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setShowPermissionPrompt(false);
          startOrientationTracking();
        }
      } catch (error) {
        console.log('Device orientation permission denied');
      }
    }
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (cont?: Container) => {
    setContainer(cont);
  }, []);

  // Detect if mobile device
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
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
              enable: !isMobile,
              rotateX: 600,
              rotateY: 1200,
            },
            gravity: isMobile ? {
              enable: true,
              acceleration: 0.5,
              maxSpeed: 3,
            } : undefined,
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
    {showPermissionPrompt && (
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={requestOrientationPermission}
          className="bg-[#00FF94] text-black px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-[#00E085] transition-all duration-300 flex items-center gap-2"
        >
          <span>🎯</span>
          Enable Tilt Effect
        </button>
      </div>
    )}
    </>
  );
};

export default ParticleBackground;