'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ContactSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
    <section id="contact" className="py-20 bg-[#111111]" ref={ref}>
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
            Let's <span className="gradient-text">Connect</span>
          </motion.h2>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="glass-card p-8">
                <h3 className="text-2xl font-semibold mb-6 text-[#00FF94]">
                  Get in Touch
                </h3>
                <p className="text-gray-300 mb-8">
                  I'm always excited to discuss new opportunities, innovative projects, 
                  or just chat about technology and automation. Let's create something amazing together!
                </p>

                <div className="space-y-6">
                  <div className="flex items-center">
                    <Mail className="w-6 h-6 text-[#00FF94] mr-4" />
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-gray-300">yameem369@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-6 h-6 text-[#00FF94] mr-4" />
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <p className="text-gray-300">+91 7889752231</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-6 h-6 text-[#00FF94] mr-4" />
                    <div>
                      <h4 className="font-semibold">Location</h4>
                      <p className="text-gray-300">Bangalore, Karnataka 560085</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="glass-card p-8">
                <h3 className="text-xl font-semibold mb-6">Follow Me</h3>
                <div className="flex space-x-4">
                  {[
                    { icon: <Github className="w-6 h-6" />, href: 'https://github.com/yameenrafiqi', label: 'GitHub' },
                    { icon: <Linkedin className="w-6 h-6" />, href: 'https://www.linkedin.com/in/yameen-rafiqi-564a35283/', label: 'LinkedIn' },
                    { icon: <Twitter className="w-6 h-6" />, href: 'https://x.com/rafiqi_yameen', label: 'Twitter' },
                  ].map((social) => (
                    <motion.a
                      key={social.label}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      href={social.href}
                      className="p-3 glass-card hover:border-[#00FF94] transition-all duration-300 group"
                    >
                      <div className="text-gray-300 group-hover:text-[#00FF94] transition-colors">
                        {social.icon}
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <div className="glass-card p-8">
                <h3 className="text-2xl font-semibold mb-6 text-[#00FF94]">
                  Send a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-[#1A1A1A] border-gray-600 focus:border-[#00FF94] text-white"
                    />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-[#1A1A1A] border-gray-600 focus:border-[#00FF94] text-white"
                    />
                  </div>
                  <Input
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-[#1A1A1A] border-gray-600 focus:border-[#00FF94] text-white"
                  />
                  <Textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="bg-[#1A1A1A] border-gray-600 focus:border-[#00FF94] text-white"
                  />
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full bg-[#00FF94] text-black hover:bg-[#00E085] font-semibold py-3 text-lg neon-glow"
                    >
                      Send Message
                      <Send className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;