'use client';

import { motion } from 'framer-motion';

export const SkeletonCard = () => {
  return (
    <div className="glass-card p-6 overflow-hidden">
      <div className="animate-pulse space-y-4">
        <div className="h-48 bg-gray-700/30 rounded-lg" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-700/30 rounded w-3/4" />
          <div className="h-4 bg-gray-700/30 rounded w-1/2" />
          <div className="h-4 bg-gray-700/30 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonBlogCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card overflow-hidden"
    >
      <div className="animate-pulse">
        <div className="h-48 bg-gray-700/30" />
        <div className="p-6 space-y-3">
          <div className="h-4 bg-gray-700/30 rounded w-1/3" />
          <div className="h-6 bg-gray-700/30 rounded w-3/4" />
          <div className="h-4 bg-gray-700/30 rounded w-full" />
          <div className="h-4 bg-gray-700/30 rounded w-2/3" />
        </div>
      </div>
    </motion.div>
  );
};

export const SkeletonProjectCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      <div className="animate-pulse">
        <div className="h-56 bg-gray-700/30" />
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-700/30 rounded w-2/3" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-700/30 rounded w-full" />
            <div className="h-4 bg-gray-700/30 rounded w-5/6" />
          </div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-700/30 rounded w-16" />
            <div className="h-6 bg-gray-700/30 rounded w-20" />
            <div className="h-6 bg-gray-700/30 rounded w-16" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
