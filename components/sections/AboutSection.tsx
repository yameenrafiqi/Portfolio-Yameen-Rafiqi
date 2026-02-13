'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, GraduationCap, Target } from 'lucide-react';
import GitHubStats from '@/components/GitHubStats';

const AboutSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section id="about" className="py-20 bg-[#0A0A0A]" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="max-w-6xl mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            About <span className="gradient-text">Me</span>
          </motion.h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="glass-card p-8">
                <h3 className="text-2xl font-semibold mb-4 text-[#00FF94]">
                  My Journey
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Computer Science undergraduate with hands-on experience as an AI Automation 
                  and Software Development Intern at DaanVeda, where I designed and implemented 
                  end-to-end automation solutions, Python-based web scrapers, and deployable 
                  full-stack systems. Skilled in building automation workflows, integrating APIs, 
                  and solving system-level engineering problems.
                </p>
                <div className="flex items-center text-sm text-gray-400 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-[#00FF94]" />
                  Kashmir → Bangalore
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <GraduationCap className="w-4 h-4 mr-2 text-[#00FF94]" />
                  PES University, B.Tech CSE (Cyber Security)
                </div>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-2xl font-semibold mb-4 text-[#00FF94]">
                  Vision & Mission
                </h3>
                <div className="flex items-start mb-4">
                  <Target className="w-5 h-5 mr-3 text-[#00FF94] mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Vision</h4>
                    <p className="text-gray-300 text-sm">
                      To build scalable and user-focused products that leverage automation, 
                      AI, and modern web technologies to solve real-world problems.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Target className="w-5 h-5 mr-3 text-[#00FF94] mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Career Goals</h4>
                    <p className="text-gray-300 text-sm">
                      Seeking opportunities in SDE, Data Scientist, Full-Stack Development, 
                      Associate Product, or AI Automation Engineering with emphasis on 
                      scalable and user-focused products.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <div className="glass-card p-8">
                <h3 className="text-2xl font-semibold mb-6 text-[#00FF94]">
                  Current Focus
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-[#00FF94] pl-4">
                    <h4 className="font-semibold mb-1">AI Automation Engineering</h4>
                    <p className="text-gray-300 text-sm">
                      Building end-to-end automation workflows using n8n, Make.com, and Python
                    </p>
                  </div>
                  <div className="border-l-4 border-[#00FF94] pl-4">
                    <h4 className="font-semibold mb-1">Full-Stack Development</h4>
                    <p className="text-gray-300 text-sm">
                      Creating modern web applications with Next.js, React, and comprehensive backend solutions
                    </p>
                  </div>
                  <div className="border-l-4 border-[#00FF94] pl-4">
                    <h4 className="font-semibold mb-1">Cyber Security</h4>
                    <p className="text-gray-300 text-sm">
                      Specializing in Information Security, Network Security, and Ethical Hacking
                    </p>
                  </div>
                  <div className="border-l-4 border-[#00FF94] pl-4">
                    <h4 className="font-semibold mb-1">Data Engineering</h4>
                    <p className="text-gray-300 text-sm">
                      Web scraping, data processing, and database management with modern tech stack
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-2xl font-semibold mb-4 text-[#00FF94]">
                  Academic Excellence
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Major</span>
                    <span className="text-gray-300">Computer Science Engineering</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Specialization</span>
                    <span className="text-gray-300">Cyber Security</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">University</span>
                    <span className="text-gray-300">PES University</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Expected Graduation</span>
                    <span className="text-gray-300">April 2027</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <div className="glass-card p-8 max-w-4xl mx-auto">
              <blockquote className="text-xl italic text-gray-300 mb-4">
                "Technology is not just about writing code; it's about solving problems, 
                creating experiences, and making life better for everyone."
              </blockquote>
              <cite className="text-[#00FF94] font-semibold">- Yameen Rafiqi</cite>
            </div>
          </motion.div>

          {/* GitHub Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-12"
          >
            <GitHubStats />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;