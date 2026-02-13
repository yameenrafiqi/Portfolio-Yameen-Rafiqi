'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Globe, 
  Database, 
  Cpu,
  Zap,
  Brain,
  Cog,
  Code,
  Server,
  GitBranch,
  Workflow
} from 'lucide-react';

const SkillsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const skillCategories = [
    {
      title: 'Programming Languages',
      skills: [
        { name: 'Python', icon: <Cpu className="w-6 h-6" /> },
        { name: 'JavaScript', icon: <Code className="w-6 h-6" /> },
        { name: 'C', icon: <Code className="w-6 h-6" /> },
      ]
    },
    {
      title: 'Web Development',
      skills: [
        { name: 'React', icon: <Globe className="w-6 h-6" /> },
        { name: 'Next.js', icon: <Globe className="w-6 h-6" /> },
        { name: 'Node.js', icon: <Server className="w-6 h-6" /> },
        { name: 'Express.js', icon: <Server className="w-6 h-6" /> },
        { name: 'Tailwind CSS', icon: <Code className="w-6 h-6" /> },
      ]
    },
    {
      title: 'Databases & Backend',
      skills: [
        { name: 'MongoDB', icon: <Database className="w-6 h-6" /> },
        { name: 'DynamoDB', icon: <Database className="w-6 h-6" /> },
        { name: 'Firebase', icon: <Database className="w-6 h-6" /> },
        { name: 'Supabase', icon: <Database className="w-6 h-6" /> },
        { name: 'MySQL', icon: <Database className="w-6 h-6" /> },
      ]
    },
    {
      title: 'Automation & Tools',
      skills: [
        { name: 'n8n', icon: <Workflow className="w-6 h-6" /> },
        { name: 'Make.com', icon: <Workflow className="w-6 h-6" /> },
        { name: 'BeautifulSoup', icon: <Brain className="w-6 h-6" /> },
        { name: 'Git', icon: <GitBranch className="w-6 h-6" /> },
        { name: 'GitHub Actions', icon: <Cog className="w-6 h-6" /> },
        { name: 'CI/CD', icon: <Cog className="w-6 h-6" /> },
      ]
    },
  ];

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
    <section id="skills" className="py-20 bg-[#111111]" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Skills & <span className="gradient-text">Technologies</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive technical expertise across automation, web development, and modern tech stack
            </p>
          </motion.div>

          <div className="space-y-12">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                variants={itemVariants}
                className="glass-card p-8"
              >
                <h3 className="text-2xl font-semibold mb-6 text-[#00FF94]">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skillIndex}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="glass-card p-4 flex flex-col items-center min-w-[100px] hover:border-[#00FF94] transition-all duration-300"
                    >
                      <div className="text-[#00FF94] mb-2">
                        {skill.icon}
                      </div>
                      <span className="text-sm font-medium text-center">{skill.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;