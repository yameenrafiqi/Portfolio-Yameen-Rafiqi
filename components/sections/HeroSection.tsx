'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const [typewriterText, setTypewriterText] = useState('');
  const fullText = 'I automate ideas into intelligent systems';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypewriterText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="ambient-glow absolute inset-0" />
      
      <div className="container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <div className="relative w-48 h-48 mx-auto mb-8">
            {/* Simple animated border */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-[#00FF94] opacity-30"
            />
            
            {/* Profile container with clean design */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="absolute inset-4 rounded-full overflow-hidden border-4 border-[#00FF94] shadow-2xl"
              style={{
                boxShadow: '0 0 30px rgba(0, 255, 148, 0.4)',
              }}
            >
              <img
                src="/IMG 2991.jpg"
                alt="Yameen Rafiqi"
                className="w-full h-full object-cover"
              />
              
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#00FF94]/10 via-transparent to-transparent" />
            </motion.div>
            
            {/* Pulsing glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(0, 255, 148, 0.2)',
                  '0 0 40px rgba(0, 255, 148, 0.4)',
                  '0 0 20px rgba(0, 255, 148, 0.2)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          Hi, I'm{' '}
          <span className="gradient-text">Yameen Rafiqi</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-8 h-8"
        >
          <span className="typewriter border-r-2 border-[#00FF94]">
            {typewriterText}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          B.Tech CSE student specializing in Cyber Security at PES University. 
          AI Automation & Software Development Intern with expertise in building 
          scalable automation workflows and full-stack applications.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            onClick={scrollToAbout}
            className="bg-[#00FF94] text-black hover:bg-[#00E085] font-semibold px-8 py-3 text-lg neon-glow"
          >
            Explore My Work
          </Button>
          <Button
            variant="outline"
            className="border-[#00FF94] text-[#00FF94] hover:bg-[#00FF94] hover:text-black px-8 py-3 text-lg"
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Let's Connect
          </Button>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={scrollToAbout}
      >
        <ChevronDown className="w-8 h-8 text-[#00FF94]" />
      </motion.div>
    </section>
  );
};

export default HeroSection;