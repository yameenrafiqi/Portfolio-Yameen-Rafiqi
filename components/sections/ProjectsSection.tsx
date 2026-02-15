'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Filter, Star, GitFork } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchGitHubRepos, categorizeRepo, getLanguageColor, getProjectImage, getProjectLiveUrl, type GitHubRepo } from '@/lib/github';
import { type ProjectVisibility } from '@/lib/projectSettings';

const ProjectsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [activeFilter, setActiveFilter] = useState('All');
  const [githubProjects, setGithubProjects] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [useGitHub, setUseGitHub] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Featured projects (fallback if GitHub fetch fails)
  const featuredProjects = [
    {
      id: 1,
      title: 'Automated LMS Platform',
      description: 'Fully automated learning management system using n8n, Make.com, and Hugging Face APIs to generate and publish educational video content, with a Next.js frontend styled using Tailwind CSS.',
      image: 'https://images.pexels.com/photos/5905857/pexels-photo-5905857.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Automation',
      tech: ['n8n', 'Make.com', 'Hugging Face', 'Next.js', 'Tailwind CSS'],
      github: '#',
      live: '#',
    },
    {
      id: 2,
      title: 'Automated Blog Platform',
      description: 'Content publishing pipeline using n8n, Make.com, and Python to optimize and streamline blog creation workflows with automated SEO optimization.',
      image: 'https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Automation',
      tech: ['n8n', 'Make.com', 'Python', 'SEO'],
      github: '#',
      live: '#',
    },
    {
      id: 3,
      title: 'Physics Learning Platform',
      description: 'Interactive, level-wise physics learning platform built for a senior theoretical physicist, featuring HTML5 Canvas-based simulations covering school to research-level concepts.',
      image: 'https://images.pexels.com/photos/256219/pexels-photo-256219.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Web',
      tech: ['Next.js', 'React', 'HTML5 Canvas', 'Physics'],
      github: '#',
      live: '#',
    },
    {
      id: 4,
      title: 'Web Scraping Pipelines',
      description: 'Data extraction pipelines using Python and BeautifulSoup for reliable structured data processing and automation.',
      image: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'AI',
      tech: ['Python', 'BeautifulSoup', 'Data Processing'],
      github: '#',
      live: '#',
    },
    {
      id: 5,
      title: 'Full-Stack Web Application',
      description: 'Production-ready application using Next.js, Tailwind CSS, and secure API key integrations with live automation workflows for real-time operations.',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Web',
      tech: ['Next.js', 'Tailwind CSS', 'API Integration', 'MongoDB'],
      github: '#',
      live: '#',
    },
    {
      id: 6,
      title: 'Security Labs',
      description: 'Hands-on labs in Information Security and Network Security, focusing on core security concepts, penetration testing, and ethical hacking.',
      image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Security',
      tech: ['Cyber Security', 'Network Security', 'Ethical Hacking'],
      github: '#',
      live: '#',
    },
  ];

  useEffect(() => {
    const loadGitHubProjects = async () => {
      setLoading(true);
      try {
        const repos = await fetchGitHubRepos();
        if (repos && repos.length > 0) {
          // Fetch visibility settings from API
          const response = await fetch('/api/settings/projects');
          const data = await response.json();
          
          let visibleRepos = repos;
          if (data.success) {
            const visibility: ProjectVisibility = data.data.visibility;
            // Filter based on visibility settings
            visibleRepos = repos.filter(repo => {
              const id = String(repo.id);
              // Default to visible if not set
              return visibility[id] !== false;
            });
          }
          
          setGithubProjects(visibleRepos);
          setUseGitHub(true);
        } else {
          setUseGitHub(false);
        }
      } catch (error) {
        console.error('Failed to fetch GitHub projects:', error);
        setUseGitHub(false);
      } finally {
        setLoading(false);
      }
    };

    loadGitHubProjects();
  }, []);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Get categories from GitHub projects or use default
  const categories = useGitHub && githubProjects.length > 0
    ? ['All', ...Array.from(new Set(githubProjects.map(repo => categorizeRepo(repo))))]
    : ['All', 'Automation', 'Web', 'AI', 'Security'];

  // Filter projects based on active filter
  const filteredProjects = useGitHub && githubProjects.length > 0
    ? activeFilter === 'All'
      ? githubProjects
      : githubProjects.filter(repo => categorizeRepo(repo) === activeFilter)
    : activeFilter === 'All'
      ? featuredProjects
      : featuredProjects.filter(project => project.category === activeFilter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="projects" className="py-20 bg-[#0A0A0A]" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="max-w-7xl mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center mb-4"
          >
            {useGitHub && githubProjects.length > 0 ? 'GitHub ' : 'Featured '}
            <span className="gradient-text">Projects</span>
          </motion.h2>

          {useGitHub && githubProjects.length > 0 && (
            <motion.p
              variants={itemVariants}
              className="text-center text-gray-400 mb-12"
            >
              Real-time projects from my GitHub repository
            </motion.p>
          )}

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <div className="flex items-center gap-2 text-sm text-gray-400 mr-4">
              <Github className="w-4 h-4 text-[#00FF94]" />
              <span>Live from GitHub</span>
            </div>
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setActiveFilter(category)}
                variant={activeFilter === category ? "default" : "outline"}
                className={`
                  ${activeFilter === category 
                    ? 'bg-[#00FF94] text-black hover:bg-[#00E085]' 
                    : 'border-[#00FF94] text-[#00FF94] hover:bg-[#00FF94] hover:text-black'
                  }
                  transition-all duration-300
                `}
              >
                <Filter className="w-4 h-4 mr-2" />
                {category}
              </Button>
            ))}
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block"
              >
                <Github className="w-12 h-12 text-[#00FF94]" />
              </motion.div>
              <p className="text-gray-400 mt-4">Loading projects from GitHub...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {useGitHub && githubProjects.length > 0 ? (
                // GitHub Projects
                filteredProjects.map((repo) => {
                  const ghRepo = repo as GitHubRepo;
                  return (
                    <motion.div
                      key={ghRepo.id}
                      variants={itemVariants}
                      whileHover={isTouchDevice ? {} : { y: -10 }}
                      className="glass-card overflow-hidden group hover:neon-glow transition-all duration-500"
                    >
                      <div className="relative overflow-hidden h-48">
                        <img
                          src={getProjectImage(ghRepo.name, ghRepo.language)}
                          alt={ghRepo.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white">{ghRepo.name.replace(/-/g, ' ').replace(/_/g, ' ')}</h3>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          {ghRepo.language && (
                            <span 
                              className="px-2 py-1 text-xs font-semibold rounded-full text-black"
                              style={{ backgroundColor: getLanguageColor(ghRepo.language) }}
                            >
                              {ghRepo.language}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              <span>{ghRepo.stargazers_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork className="w-4 h-4" />
                              <span>{ghRepo.forks_count}</span>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 bg-[#00FF94] text-black rounded-full">
                            {categorizeRepo(ghRepo)}
                          </span>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3 min-h-[3.5rem]">
                          {ghRepo.description || 'No description provided'}
                        </p>

                        {ghRepo.topics && ghRepo.topics.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {ghRepo.topics.slice(0, 3).map((topic) => (
                              <span
                                key={topic}
                                className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-3 mt-4">
                          <motion.a
                            whileHover={isTouchDevice ? {} : { scale: 1.05 }}
                            href={ghRepo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`py-2 px-4 bg-[#00FF94] text-black rounded-lg font-semibold text-sm text-center hover:bg-[#00E085] transition-colors flex items-center justify-center gap-2 ${
                              getProjectLiveUrl(ghRepo.name) || ghRepo.homepage ? 'flex-1' : 'w-full'
                            }`}
                          >
                            <Github className="w-4 h-4" />
                            View Code
                          </motion.a>
                          {(getProjectLiveUrl(ghRepo.name) || ghRepo.homepage) && (
                            <motion.a
                              whileHover={isTouchDevice ? {} : { scale: 1.05 }}
                              href={getProjectLiveUrl(ghRepo.name) || ghRepo.homepage || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2 px-4 border border-[#00FF94] text-[#00FF94] rounded-lg font-semibold text-sm hover:bg-[#00FF94] hover:text-black transition-colors flex items-center justify-center gap-2"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Check Live
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                // Featured Projects (Fallback)
                filteredProjects.map((project) => {
                  const featuredProject = project as typeof featuredProjects[0];
                  return (
                    <motion.div
                      key={featuredProject.id}
                      variants={itemVariants}
                      whileHover={isTouchDevice ? {} : { y: -10 }}
                      className="glass-card overflow-hidden group hover:neon-glow transition-all duration-500"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={featuredProject.image}
                          alt={featuredProject.title}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="flex space-x-4">
                            <motion.a
                              whileHover={isTouchDevice ? {} : { scale: 1.1 }}
                              href={featuredProject.github}
                              className="p-3 bg-[#00FF94] text-black rounded-full hover:bg-[#00E085] transition-colors"
                            >
                              <Github className="w-5 h-5" />
                            </motion.a>
                            <motion.a
                              whileHover={isTouchDevice ? {} : { scale: 1.1 }}
                              href={featuredProject.live}
                              className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                            >
                              <ExternalLink className="w-5 h-5" />
                            </motion.a>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold">{featuredProject.title}</h3>
                          <span className="text-xs px-2 py-1 bg-[#00FF94] text-black rounded-full">
                            {featuredProject.category}
                          </span>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                          {featuredProject.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {featuredProject.tech.map((tech) => (
                            <span
                              key={tech}
                              className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}

          <motion.div
            variants={itemVariants}
            className="text-center mt-12"
          >
            {useGitHub && githubProjects.length > 0 ? (
              <Button
                variant="outline"
                className="border-[#00FF94] text-[#00FF94] hover:bg-[#00FF94] hover:text-black px-8 py-3 text-lg"
                onClick={() => window.open('https://github.com/yameenrafiqi', '_blank')}
              >
                <Github className="w-5 h-5 mr-2" />
                View All on GitHub
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-[#00FF94] text-[#00FF94] hover:bg-[#00FF94] hover:text-black px-8 py-3 text-lg"
              >
                View All Projects
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;