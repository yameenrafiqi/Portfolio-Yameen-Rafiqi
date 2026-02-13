/**
 * Component Performance Wrapper
 * Monitors component render performance in development
 */
'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface PerformanceMonitorProps {
  name: string;
  children: ReactNode;
  enabled?: boolean;
}

export function PerformanceMonitor({
  name,
  children,
  enabled = process.env.NODE_ENV === 'development',
}: PerformanceMonitorProps) {
  const renderCount = useRef(0);
  const startTime = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = startTime.current ? endTime - startTime.current : 0;

    console.log(`🔍 [${name}] Render #${renderCount.current} - ${renderTime.toFixed(2)}ms`);

    return () => {
      startTime.current = performance.now();
    };
  });

  return <>{children}</>;
}

/**
 * Lazy load component wrapper with loading state
 */
import { Suspense } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

export function LazyLoad({
  children,
  fallback = <LoadingFallback />,
  className = '',
}: LazyLoadProps) {
  return (
    <Suspense fallback={fallback}>
      <div className={className}>{children}</div>
    </Suspense>
  );
}

/**
 * Default loading fallback
 */
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gray-700 h-12 w-12"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
