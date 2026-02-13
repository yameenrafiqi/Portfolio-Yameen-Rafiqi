'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Download, GraduationCap, Briefcase, Award, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ResumeSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const timeline = [
    {
      year: 'Jun 2025 - Jan 2026',
      title: 'Software Development & AI Automation Intern',
      organization: 'DaanVeda',
      type: 'experience',
      description: 'Implemented end-to-end automation workflows and developed full-stack web applications with AI integration.',
      achievements: [
        'Implemented end-to-end automation workflows using n8n and Make.com',
        'Built Python-based web scraping tools with BeautifulSoup for structured data collection',
        'Developed and deployed a full-stack web application using Next.js, Tailwind CSS, and secure API key integrations',
        'Connected live automation workflows with production application to enable real-time operations',
        'Evaluated and experimented with emerging technologies to enhance system performance and efficiency'
      ],
    },
    {
      year: 'Expected Apr 2027',
      title: 'B.Tech Computer Science Engineering',
      organization: 'PES University',
      type: 'education',
      description: 'Specialization in Cyber Security with comprehensive coursework in automation, AI, and security.',
      achievements: [
        'Specialization in Cyber Security',
        'Awarded DAC Scholarship for Academic Excellence',
        'Hands-on experience in Information & Network Security',
        'Strong foundation in automation and intelligent systems'
      ],
    },
    {
      year: '2021 - 2023',
      title: '11th & 12th - JEE Preparation',
      organization: 'Allen Srinagar',
      type: 'education',
      description: 'Intensive preparation for Joint Entrance Examination with focus on Physics, Chemistry, and Mathematics.',
      achievements: [
        'Completed rigorous JEE preparation program',
        'Developed analytical and problem-solving skills'
      ],
    },
    {
      year: '2021',
      title: 'Secondary Education',
      organization: 'Crescent Public School, Lal bazar Srinagar',
      type: 'education',
      description: 'Completed secondary education in Srinagar, Kashmir.',
      achievements: [
        'Strong academic foundation',
        'Early interest in technology and science'
      ],
    },
  ];

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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="resume" className="py-20 bg-[#0A0A0A]" ref={ref}>
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
            My <span className="gradient-text">Journey</span>
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <Button
              asChild
              className="bg-[#00FF94] text-black hover:bg-[#00E085] font-semibold px-8 py-3 text-lg neon-glow"
            >
              <a href="/YameenRafiqi_Resume.pdf" download="YameenRafiqi_Resume.pdf">
                <Download className="w-5 h-5 mr-2" />
                Download Resume
              </a>
            </Button>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-gradient-to-b from-[#00FF94] to-transparent"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#00FF94] rounded-full border-4 border-[#0A0A0A] z-10"></div>

                  {/* Content */}
                  <div className={`flex-1 ml-16 md:ml-0 ${
                    index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                  }`}>
                    <div className="glass-card p-6 hover:neon-glow transition-all duration-300">
                      <div className="flex items-center mb-3">
                        <div className="text-[#00FF94] mr-3">
                          {item.type === 'education' ? (
                            <GraduationCap className="w-6 h-6" />
                          ) : item.type === 'experience' ? (
                            <Briefcase className="w-6 h-6" />
                          ) : (
                            <Award className="w-6 h-6" />
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          {item.year}
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-[#00FF94] font-medium mb-3">{item.organization}</p>
                      <p className="text-gray-300 mb-4">{item.description}</p>

                      <div className="space-y-2">
                        {item.achievements.map((achievement, achievementIndex) => (
                          <div key={achievementIndex} className="flex items-start">
                            <div className="w-2 h-2 bg-[#00FF94] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-300">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Key Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: 'Work Experience', value: '7+ months' },
              { label: 'Projects Completed', value: '6+' },
              { label: 'Technologies', value: '20+' },
              { label: 'Academic Awards', value: '2' },
            ].map((stat, index) => (
              <div key={index} className="text-center glass-card p-6">
                <div className="text-3xl font-bold text-[#00FF94] mb-2">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResumeSection;