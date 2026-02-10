import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar'; // Ensure correct path
import Footer from '../Components/Footer'; // Ensure correct path
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
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-50">
      <NavBar />
      
      {/* ================= HERO SECTION (Home) ================= */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/home1.png')", // Ensure image is in public folder
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Hero Content */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-2xl">
            LEARN. TRADE. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              SUCCEED.
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
             Take your trading journey to the next level with TradeXpert Academy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-green-600/40"
            >
              Start Learning
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-all">
              Watch Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* --- PART 1: Main Intro --- */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20"
          >
            {/* Image Side */}
            <motion.div variants={fadeInUp} className="relative">
              <div className="absolute -inset-4 bg-green-100 rounded-xl transform -rotate-2"></div>
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="About TradeXpert" 
                className="relative rounded-lg shadow-2xl w-full object-cover h-[400px]"
              />
            </motion.div>

            {/* Text Side */}
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 mb-2">
                 <span className="h-0.5 w-8 bg-gray-400"></span>
                 <span className="text-gray-500 font-semibold tracking-wide uppercase text-sm">ABOUT US</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 uppercase">
                YOUR TRUSTED PARTNER IN FOREX TRADING EXCELLENCE
              </h3>
              
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                Join thousands of traders who trust us to enhance their trading skills.
              </h4>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Established in 2025, TradeXpert Academy is founded by seasoned professionals with over eight years of experience in the Forex market. Our mission is to empower both beginners and experienced traders by providing comprehensive Forex trading education, real-time gold market signals, and advanced trading tools.
              </p>
              
              <ul className="space-y-3">
                {[
                  'Learn professional Forex trading strategies.',
                  'Receive real-time Gold trading signals.',
                  'Use custom-built MT4 & MT5 indicators.',
                  'Automate trading with our expert bots.',
                  'Start Copy Trading with ease.'
                ].map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <svg className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* --- PART 2: Mission & Vision --- */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 border-t border-gray-100 pt-16"
          >
            {/* Mission */}
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-gray-400 text-sm tracking-widest uppercase">MISSION</span>
                 <span className="h-px w-12 bg-gray-400"></span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6 uppercase">OUR MISSION</h3>
              <p className="text-gray-600 leading-relaxed text-justify">
                At TradeXpert Academy, our mission is to empower traders at all levels by providing comprehensive Forex education, innovative trading tools, and personalized support.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-gray-400 text-sm tracking-widest uppercase">VISION</span>
                 <span className="h-px w-12 bg-gray-400"></span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6 uppercase">OUR VISION</h3>
              <p className="text-gray-600 leading-relaxed text-justify">
                Our vision is to be a global leader in Forex trading education and technology, recognized for our dedication to excellence, innovation, and integrity.
              </p>
            </motion.div>
          </motion.div>

          {/* --- PART 3: Why Choose Us --- */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mt-24 pt-16 border-t border-gray-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-400 text-sm tracking-widest uppercase">WHY CHOOSE US?</span>
              <span className="h-px w-12 bg-gray-400"></span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 uppercase tracking-tight max-w-4xl leading-tight">
              TAKE YOUR TRADING JOURNEY TO THE NEXT LEVEL WITH TRADEXPERT ACADEMY!
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl">
              {[
                { title: "Experienced Team", desc: "Expert traders & developers" },
                { title: "Real-Time Support", desc: "24/7 assistance & market insights" },
                { title: "Innovative Tools", desc: "Cutting-edge indicators & bots" },
                { title: "Proven Success", desc: "A community of profitable traders" }
              ].map((item, idx) => (
                <div key={idx} className="group p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md rounded-xl transition-all duration-300 bg-gradient-to-r from-blue-50/50 to-transparent">
                  <div className="flex items-start pl-4 border-l-4 border-blue-600 h-20 group-hover:h-24 transition-all duration-300">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      <span className="font-bold text-xl text-gray-900 block mb-1">{item.title}:</span>
                      <span className="font-medium">{item.desc}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ================= COURSES SECTION ================= */}
      <section id="courses" className="py-24 bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="h-0.5 w-12 bg-blue-600"></span>
              <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">OUR COURSES</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 uppercase">
              FROM BEGINNER TO PRO
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              LEARN. TRADE. SUCCEED.
            </h3>
          </motion.div>

          {/* Courses Grid */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
          >
            {/* Beginner Course */}
            <motion.div variants={fadeInUp} className="group relative bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:bg-white">
              <div className="absolute -top-4 left-6 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                1
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6 mt-8">Master Forex from Beginner to Advanced</h3>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Module 1: Forex Trading Basics',
                  'Module 2: Essential Trends & Market Structure',
                  'Module 3: Price Action Systems',
                  'Module 4: Risk Management & Psychology',
                  'Module 5: Advanced Forex & Institutional Strategies'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start text-gray-700 group-hover:text-blue-700 transition-colors">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Enroll Now
              </button>
            </motion.div>

            {/* Advanced Course */}
            <motion.div variants={fadeInUp} className="group relative bg-white/80 backdrop-blur-sm border border-indigo-200/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:bg-white">
              <div className="absolute -top-4 right-6 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                2
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6 mt-8">Master Forex Trading Analysis to Pro</h3>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Module 1: Forex Trading Analysis',
                  'Module 2: Advanced Technical Analysis',
                  'Module 3: Risk Management & Trading Psychology',
                  'Module 4: Copy Trading & Automated Strategies',
                  'Module 5: Scaling Up & Professional Trading'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start text-gray-700 group-hover:text-indigo-700 transition-colors">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Enroll Now
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-16"
          >
             <div className="flex items-center gap-2 mb-2">
                 <span className="text-gray-500 font-semibold tracking-wide uppercase text-sm">SERVICES</span>
                 <span className="h-0.5 w-12 bg-gray-400"></span>
             </div>
             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-tight">
               FEATURED SERVICES
             </h2>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            
            {/* Service 1: Forex Trading Education */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              {/* Image Container */}
              <div className="h-64 overflow-hidden relative">
                 <img 
                   src="/forex-education.jpg" 
                   alt="Forex Trading" 
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              </div>

              {/* Floating Icon */}
              <div className="absolute top-56 left-1/2 transform -translate-x-1/2 flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg z-10 border-4 border-white">
                 <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                 </svg>
              </div>

              {/* Content */}
              <div className="pt-12 pb-8 px-8 text-center">
                 <h3 className="text-2xl font-bold text-blue-700 mb-3">Forex Trading Education</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">
                   Beginner to advanced trading courses. Interactive webinars & live training. Market analysis & strategy sessions.
                 </p>
              </div>
            </motion.div>

            {/* Service 2: Gold Trading Signals */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="h-64 overflow-hidden relative">
                 <img 
                   src="/gold-trading.jpg" 
                   alt="Gold Trading" 
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              </div>

              <div className="absolute top-56 left-1/2 transform -translate-x-1/2 flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg z-10 border-4 border-white">
                 <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                 </svg>
              </div>

              <div className="pt-12 pb-8 px-8 text-center">
                 <h3 className="text-2xl font-bold text-gray-800 mb-3">Gold Trading Signals</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">
                   Real-time, accurate signals. Telegram & email alerts for instant updates. Expert analysis for high-profit trades.
                 </p>
              </div>
            </motion.div>

            {/* Service 3: Trading Bots */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="h-64 overflow-hidden relative">
                 <img 
                   src="/bot-trading.jpg" 
                   alt="Trading Bots" 
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              </div>

              <div className="absolute top-56 left-1/2 transform -translate-x-1/2 flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg z-10 border-4 border-white">
                 <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                 </svg>
              </div>

              <div className="pt-12 pb-8 px-8 text-center">
                 <h3 className="text-2xl font-bold text-gray-800 mb-3">Trading Bots for Automation</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">
                   MT4 & MT5 bots for hands-free trading. AI-powered strategies for better execution. Customizable to suit your trading style.
                 </p>
              </div>
            </motion.div>

            {/* Service 4: Copy Trading */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="h-64 overflow-hidden relative">
                 <img 
                   src="/copy-trading.jpg" 
                   alt="Copy Trading" 
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              </div>

              <div className="absolute top-56 left-1/2 transform -translate-x-1/2 flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg z-10 border-4 border-white">
                 <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                 </svg>
              </div>

              <div className="pt-12 pb-8 px-8 text-center">
                 <h3 className="text-2xl font-bold text-gray-800 mb-3">Copy Trading for Beginners</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">
                   Follow expert traders with proven success. Automate trades with minimal effort. Safe & reliable investment options.
                 </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= TEAM & CONTACT SECTION ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
          >
            {/* Team Section */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl font-bold text-gray-900 uppercase tracking-tight mb-8 flex items-center gap-3">
                <span className="h-1 w-16 bg-blue-600"></span>
                OUR TEAM
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-12 max-w-lg">
                Our company comprises expert traders, analysts and developers, each bringing over eight years of experience. Their experience and unwavering commitment drive the continuous development of educational programs, trading tools and support systems, ensuring our clients receive unparalleled guidance and resources in today's competitive trading landscape.
              </p>
              

            </motion.div>

            {/* Contact Form */}
            <motion.div variants={fadeInUp} className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 uppercase tracking-tight mb-8 flex items-center gap-3">
                  <span className="h-1 w-16 bg-blue-600"></span>
                  GET IN TOUCH WITH US TODAY
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6 bg-blue-50/50 backdrop-blur-sm p-8 rounded-3xl border border-blue-200">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-blue-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all bg-white/80 backdrop-blur-sm text-lg placeholder-gray-500"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-blue-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all bg-white/80 backdrop-blur-sm text-lg placeholder-gray-500"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-blue-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all bg-white/80 backdrop-blur-sm text-lg placeholder-gray-500"
                    required
                  />
                </div>
                
                <div>
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-blue-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all bg-white/80 backdrop-blur-sm text-lg placeholder-gray-500 resize-none"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Message
                </button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
