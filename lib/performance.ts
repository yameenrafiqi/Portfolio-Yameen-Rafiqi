/**
 * Performance monitoring utilities for tracking Core Web Vitals
 * This helps measure and optimize user experience
 */

export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
}

/**
 * Report Web Vitals to analytics
 * Can be integrated with Google Analytics, Vercel Analytics, etc.
 */
export function reportWebVitals(metric: WebVitalsMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Web Vital:', {
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
    });
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.value),
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta,
        metric_rating: metric.rating,
      });
    }

    // Example: Send to custom analytics endpoint
    if (typeof window !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        url: window.location.href,
        timestamp: Date.now(),
      });

      // Uncomment and add your analytics endpoint
      // navigator.sendBeacon('/api/analytics', body);
    }
  }
}

/**
 * Measure component render time
 */
export function measurePerformance(
  name: string,
  callback: () => void | Promise<void>
) {
  if (typeof window === 'undefined') return;

  const startTime = performance.now();
  const result = callback();

  if (result instanceof Promise) {
    result.then(() => {
      const endTime = performance.now();
      console.log(`⚡ ${name} took ${(endTime - startTime).toFixed(2)}ms`);
    });
  } else {
    const endTime = performance.now();
    console.log(`⚡ ${name} took ${(endTime - startTime).toFixed(2)}ms`);
  }
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string) {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImages() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01,
    }
  );

  document.querySelectorAll('img.lazy').forEach((img) => {
    imageObserver.observe(img);
  });
}

/**
 * Detect slow connection and adjust features accordingly
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined') return false;

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (!connection) return false;

  // Consider 2G, slow-2g, or effectiveType as slow
  return (
    connection.effectiveType === 'slow-2g' ||
    connection.effectiveType === '2g' ||
    connection.saveData === true
  );
}

/**
 * Get device type for responsive optimizations
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' | 'tv' {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1920) return 'desktop';
  return 'tv';
}

/**
 * Optimize animations based on device capability
 */
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Memory usage monitoring (Chrome only)
 */
export function checkMemoryUsage() {
  if (typeof window === 'undefined') return null;
  
  const memory = (performance as any).memory;
  if (!memory) return null;

  return {
    usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1048576), // MB
    totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1048576), // MB
    jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
  };
}
