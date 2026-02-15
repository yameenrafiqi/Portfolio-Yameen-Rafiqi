'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Clock, Eye, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface WebVitalsData {
  CLS: number | null;
  LCP: number | null;
  FCP: number | null;
  TTFB: number | null;
  INP: number | null;
}

const WebVitalsMonitor = () => {
  const [vitals, setVitals] = useState<WebVitalsData>({
    CLS: null,
    LCP: null,
    FCP: null,
    TTFB: null,
    INP: null,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ onCLS, onLCP, onFCP, onTTFB, onINP }) => {
        onCLS((metric) => {
          setVitals((prev) => ({ ...prev, CLS: metric.value }));
        });
        onLCP((metric) => {
          setVitals((prev) => ({ ...prev, LCP: metric.value }));
        });
        onFCP((metric) => {
          setVitals((prev) => ({ ...prev, FCP: metric.value }));
        });
        onTTFB((metric) => {
          setVitals((prev) => ({ ...prev, TTFB: metric.value }));
        });
        onINP((metric) => {
          setVitals((prev) => ({ ...prev, INP: metric.value }));
        });
      });
    }
  }, []);

  const getScoreColor = (metric: string, value: number | null) => {
    if (value === null) return 'text-gray-400';

    const thresholds: Record<string, { good: number; fair: number }> = {
      CLS: { good: 0.1, fair: 0.25 },
      LCP: { good: 2500, fair: 4000 },
      FCP: { good: 1800, fair: 3000 },
      TTFB: { good: 800, fair: 1800 },
      INP: { good: 200, fair: 500 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'text-gray-400';

    if (value <= threshold.good) return 'text-green-400';
    if (value <= threshold.fair) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatValue = (metric: string, value: number | null) => {
    if (value === null) return '-';
    
    if (metric === 'CLS') {
      return value.toFixed(3);
    }
    return Math.round(value).toString();
  };

  const getScoreBadge = (metric: string, value: number | null) => {
    if (value === null) return 'Loading...';

    const thresholds: Record<string, { good: number; fair: number }> = {
      CLS: { good: 0.1, fair: 0.25 },
      LCP: { good: 2500, fair: 4000 },
      FCP: { good: 1800, fair: 3000 },
      TTFB: { good: 800, fair: 1800 },
      INP: { good: 200, fair: 500 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'Unknown';

    if (value <= threshold.good) return 'Good';
    if (value <= threshold.fair) return 'Needs Improvement';
    return 'Poor';
  };

  const metrics = [
    {
      name: 'LCP',
      label: 'Largest Contentful Paint',
      description: 'Loading performance',
      icon: Eye,
      unit: 'ms',
      value: vitals.LCP,
    },
    {
      name: 'INP',
      label: 'Interaction to Next Paint',
      description: 'Responsiveness',
      icon: Zap,
      unit: 'ms',
      value: vitals.INP,
    },
    {
      name: 'CLS',
      label: 'Cumulative Layout Shift',
      description: 'Visual stability',
      icon: Activity,
      unit: '',
      value: vitals.CLS,
    },
    {
      name: 'FCP',
      label: 'First Contentful Paint',
      description: 'Initial render',
      icon: Clock,
      unit: 'ms',
      value: vitals.FCP,
    },
    {
      name: 'TTFB',
      label: 'Time to First Byte',
      description: 'Server response',
      icon: TrendingUp,
      unit: 'ms',
      value: vitals.TTFB,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 gradient-text">Web Vitals</h2>
        <p className="text-gray-400">Real-time performance metrics for your portfolio</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const scoreColor = getScoreColor(metric.name, metric.value);
          const scoreBadge = getScoreBadge(metric.name, metric.value);
          
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card p-6 border-gray-700 hover:neon-glow transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#00FF94]/10 rounded-lg">
                    <Icon className="w-6 h-6 text-[#00FF94]" />
                  </div>
                  <span 
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      scoreBadge === 'Good' 
                        ? 'bg-green-500/20 text-green-400' 
                        : scoreBadge === 'Needs Improvement'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : scoreBadge === 'Poor'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {scoreBadge}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-1 text-white">{metric.label}</h3>
                <p className="text-sm text-gray-400 mb-4">{metric.description}</p>

                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold ${scoreColor}`}>
                    {formatValue(metric.name, metric.value)}
                  </span>
                  <span className="text-gray-500 text-sm">{metric.unit}</span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="glass-card p-6 border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-white">Performance Guidelines</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-green-400 rounded-full"></span>
            <span className="text-gray-300"><strong className="text-green-400">Good:</strong> Your site meets performance best practices</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
            <span className="text-gray-300"><strong className="text-yellow-400">Needs Improvement:</strong> Consider optimizing this metric</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-red-400 rounded-full"></span>
            <span className="text-gray-300"><strong className="text-red-400">Poor:</strong> This metric should be improved for better UX</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WebVitalsMonitor;
