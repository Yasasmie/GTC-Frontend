import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar'; 
import Footer from '../Components/Footer'; 
import { motion } from 'framer-motion';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="font-sans antialiased text-gray-200 bg-black">
      <NavBar />
      
      {/* ================= HERO SECTION ================= */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/home1.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/80"></div>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-2xl">
            LEARN. TRADE. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
              SUCCEED.
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto font-light">
              Take your trading journey to the next level with <span className="text-amber-500 font-medium">Asset Farm Academy</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-amber-500/30"
            >
              Start Learning
            </button>
            <button 
              onClick={() => navigate('/careers')}
              className="px-8 py-4 bg-transparent border-2 border-amber-500 text-amber-500 font-bold rounded-full hover:bg-amber-500/10 hover:border-amber-400 transition-all transform hover:scale-105"
            >
              Join Our Team
            </button>
            <button className="px-8 py-4 bg-zinc-900/50 border border-zinc-700 text-white font-bold rounded-full hover:bg-zinc-800 transition-all">
              Watch Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section id="about" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20"
          >
            <motion.div variants={fadeInUp} className="relative">
              <div className="absolute -inset-4 bg-amber-600/10 rounded-xl transform -rotate-2"></div>
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="About Asset Farm" 
                className="relative rounded-lg shadow-2xl w-full object-cover h-[400px] border border-amber-500/30"
              />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 mb-2">
                 <span className="h-0.5 w-8 bg-amber-500"></span>
                 <span className="text-amber-500 font-semibold tracking-wide uppercase text-sm">ABOUT US</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white uppercase">
                YOUR TRUSTED PARTNER IN <span className="text-amber-500 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">FOREX EXCELLENCE</span>
              </h3>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                At FX Gold Technologies, we specialize in developing advanced MetaTrader 5 (MT5) Expert Advisor (EA) systems designed specifically for the gold trading market. Our mission is to empower traders and investors with intelligent automation tools that enhance trading efficiency, accuracy, and profitability.

                Beyond software development, we are building a strong network of sales agents—both full-time and part-time—who share our vision of expanding access to smart trading solutions worldwide. We provide comprehensive support and training for our partners, enabling them to grow alongside us in a fast-moving financial technology environment.

                In addition to our trading innovations, FX Gold Technologies is committed to personal and professional development. We conduct training programs and personality development sessions aimed at individuals who aspire to build financial independence and explore new income opportunities through technology-driven trading.

                Driven by a passion for innovation and excellence, we continue to deliver dependable, result-oriented systems that transform the way traders engage with the global gold market.              </p>
              
              <ul className="space-y-3">
                {[
                  'Learn professional Forex trading strategies.',
                  'Receive real-time Gold trading signals.',
                  'Use custom-built MT4 & MT5 indicators.',
                  'Automate trading with our expert bots.'
                ].map((item, index) => (
                  <li key={index} className="flex items-start text-gray-300">
                    <svg className="w-5 h-5 text-amber-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Mission & Vision */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 border-t border-white/10 pt-16"
          >
            <motion.div variants={fadeInUp} className="bg-zinc-900/50 p-8 rounded-2xl border border-amber-500/20">
              <h3 className="text-2xl font-bold text-amber-500 mb-4 uppercase">OUR MISSION</h3>
              <p className="text-gray-400 leading-relaxed">
                Our mission is to empower traders worldwide through innovative automated trading technologies that simplify and optimize the gold trading process. We strive to deliver reliable MT5 Expert Advisors, provide continuous education, and create income opportunities for individuals seeking financial growth through technology and smart trading strategies.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-zinc-900/50 p-8 rounded-2xl border border-amber-500/20">
              <h3 className="text-2xl font-bold text-amber-500 mb-4 uppercase">OUR VISION</h3>
              <p className="text-gray-400 leading-relaxed">
                Our vision is to become a global leader in AI-powered gold trading solutions, recognized for our commitment to innovation, transparency, and professional development. We aim to build a thriving community of traders, partners, and learners working together toward sustainable financial success.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= COURSES SECTION ================= */}
      <section id="courses" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase">
              PREMIUM <span className="text-amber-500">COURSES</span>
            </h2>
            <div className="h-1 w-24 bg-amber-500 mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Course Card 1 */}
            <motion.div variants={fadeInUp} className="group bg-zinc-900 border border-amber-500/20 rounded-3xl p-8 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all duration-500">
              <span className="text-amber-500 font-bold text-sm tracking-widest uppercase">Level 01</span>
              <h3 className="text-2xl font-bold text-white mb-6 mt-2">Beginner to Advanced Mastery</h3>
              <ul className="space-y-4 mb-8 text-gray-400">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Price Action Systems</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Institutional Strategies</li>
              </ul>
              <button className="w-full bg-amber-500 hover:bg-amber-400 text-black py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1">
                Enroll Now
              </button>
            </motion.div>

            {/* Course Card 2 */}
            <motion.div variants={fadeInUp} className="group bg-zinc-900 border border-amber-500/20 rounded-3xl p-8 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all duration-500">
              <span className="text-amber-500 font-bold text-sm tracking-widest uppercase">Level 02</span>
              <h3 className="text-2xl font-bold text-white mb-6 mt-2">Pro Analysis & Automation</h3>
              <ul className="space-y-4 mb-8 text-gray-400">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Automated Bot Strategies</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Advanced Psychology</li>
              </ul>
              <button className="w-full bg-transparent border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1">
                Enroll Now
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section id="services" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 uppercase text-center">
            FEATURED <span className="text-amber-500">SERVICES</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "MT5 Gold Trading Bot Development", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
              { title: "Partner & Sales Agent Program", icon: "M12 3v1m0 16v1m9-9h-1M4 12H3" },
              { title: "Personality & Skill Development Programs", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3" },
              { title: "Trading & Income Growth Workshops", icon: "M8 7h12m0 0l-4-4m4 4l-4 4" }
            ].map((service, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="bg-black p-6 rounded-2xl border border-white/5 hover:border-amber-500/40 transition-all text-center group">
                <div className="mb-4 flex justify-center text-amber-500 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold text-white mb-8">
                GET IN <span className="text-amber-500">TOUCH</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Ready to dominate the markets? Our expert team is here to guide you 24/7.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-amber-500">
                  <span className="font-bold">Email:</span>
                  <span className="text-gray-300">fxgoldsupport@gmail.com</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-8 rounded-3xl border border-amber-500/20 shadow-xl shadow-amber-900/5">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full p-4 bg-black border border-white/10 rounded-xl focus:border-amber-500 outline-none text-white transition-all placeholder-gray-600"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-4 bg-black border border-white/10 rounded-xl focus:border-amber-500 outline-none text-white transition-all placeholder-gray-600"
                required
              />
              <textarea
                name="message"
                rows="4"
                placeholder="Your Message"
                className="w-full p-4 bg-black border border-white/10 rounded-xl focus:border-amber-500 outline-none text-white transition-all resize-none placeholder-gray-600"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold py-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all uppercase tracking-widest"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;