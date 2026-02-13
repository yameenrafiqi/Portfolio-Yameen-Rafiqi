'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, GitFork, Users, Code2 } from 'lucide-react';
import { fetchGitHubUser, fetchGitHubRepos, getRepoStats } from '@/lib/github';

interface GitHubStatsData {
  repos: number;
  stars: number;
  forks: number;
  followers: number;
}

const GitHubStats = () => {
  const [stats, setStats] = useState<GitHubStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGitHubStats = async () => {
      try {
        const [user, repos] = await Promise.all([
          fetchGitHubUser(),
          fetchGitHubRepos(),
        ]);

        if (user && repos) {
          const repoStats = getRepoStats(repos);
          setStats({
            repos: user.public_repos,
            stars: repoStats.totalStars,
            forks: repoStats.totalForks,
            followers: user.followers,
          });
        }
      } catch (error) {
        console.error('Failed to load GitHub stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGitHubStats();
  }, []);

  if (loading || !stats) {
    return null;
  }

  const statItems = [
    {
      icon: <Code2 className="w-5 h-5" />,
      label: 'Repositories',
      value: stats.repos,
      color: '#00FF94',
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: 'Total Stars',
      value: stats.stars,
      color: '#FFD700',
    },
    {
      icon: <GitFork className="w-5 h-5" />,
      label: 'Forks',
      value: stats.forks,
      color: '#00D4FF',
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Followers',
      value: stats.followers,
      color: '#FF6B9D',
    },
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Github className="w-6 h-6 text-[#00FF94]" />
        <h3 className="text-xl font-semibold">GitHub Activity</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center p-4 rounded-lg bg-[#1A1A1A] hover:bg-[#222222] transition-colors"
          >
            <div className="flex justify-center mb-2" style={{ color: item.color }}>
              {item.icon}
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: item.color }}>
              {item.value}
            </div>
            <div className="text-xs text-gray-400">{item.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.a
        href="https://github.com/yameenrafiqi"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        className="mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-[#00FF94] text-black rounded-lg font-semibold text-sm hover:bg-[#00E085] transition-colors w-full"
      >
        <Github className="w-4 h-4" />
        View GitHub Profile
      </motion.a>
    </div>
  );
};

export default GitHubStats;
