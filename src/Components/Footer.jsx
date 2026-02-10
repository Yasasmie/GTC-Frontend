import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  // State for Scroll to Top Button Visibility
  const [showScroll, setShowScroll] = useState(false);

  // Check scroll position to toggle button visibility
  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scrollTop', checkScrollTop); // Catch custom event if used
    window.addEventListener('scroll', checkScrollTop);    // Standard scroll event
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  // Scroll to Top Function
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand & Contact */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
               {/* Replace with your actual logo img if available */}
               <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
               </svg>
               <span className="text-2xl font-bold tracking-tighter">
                 TradeXpert<span className="text-green-500">Academy</span>
               </span>
            </Link>
            <p className="text-gray-400 text-sm">
              Email: <a href="mailto:info@tradexpert.com" className="hover:text-green-500 transition-colors">info@tradexpert.com</a>
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4">
              <SocialIcon href="#" label="Twitter/X">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </SocialIcon>
              <SocialIcon href="#" label="Facebook">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </SocialIcon>
              <SocialIcon href="#" label="Instagram">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </SocialIcon>
              <SocialIcon href="#" label="LinkedIn">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </SocialIcon>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Useful Links</h3>
            <ul className="space-y-4">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/about">About us</FooterLink>
              <FooterLink to="/services">Services</FooterLink>
              <FooterLink to="/terms">Terms of service</FooterLink>
              <FooterLink to="/privacy">Privacy policy</FooterLink>
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Our Services</h3>
            <ul className="space-y-4">
              <FooterLink to="/services/forex">Forex Trading Education</FooterLink>
              <FooterLink to="/services/gold">Gold Trading Signals</FooterLink>
              <FooterLink to="/services/indicators">Custom Indicators for MT4 & MT5</FooterLink>
              <FooterLink to="/services/bots">Trading Bots for Automation</FooterLink>
              <FooterLink to="/services/copy-trading">Copy Trading for Beginners</FooterLink>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Our Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter and receive the latest news about our products and services!
            </p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
              />
              <button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; Copyright <strong className="text-white">TradeXpert</strong>. All Rights Reserved
          </p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0">
            Designed by <span className="text-green-500 font-bold">TX</span>
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollTop}
        className={`fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md shadow-lg transition-all duration-300 transform z-50 ${showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

// Sub-components for cleaner code
const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-gray-400 hover:text-green-500 transition-colors flex items-center">
      <span className="text-green-500 mr-2">›</span> {children}
    </Link>
  </li>
);

const SocialIcon = ({ href, label, children }) => (
  <a 
    href={href} 
    aria-label={label}
    className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-300"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  </a>
);

export default Footer;
