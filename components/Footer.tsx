'use client';

import { motion } from 'framer-motion';
import { Heart, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <span className="text-2xl font-bold gradient-text">Yameen Rafiqi</span>
              </motion.div>
              <p className="text-gray-400 mt-2">
                Automating ideas into intelligent systems
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToTop}
                className="mb-4 p-3 glass-card hover:border-[#00FF94] transition-all duration-300 group"
              >
                <ArrowUp className="w-5 h-5 text-gray-300 group-hover:text-[#00FF94] transition-colors" />
              </motion.button>
              
              <div className="flex items-center text-gray-400 text-sm">
                Made with{' '}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="mx-1"
                >
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                </motion.div>
                by Yameen Rafiqi
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Yameen Rafiqi. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;