import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  // State for Scroll to Top Button Visibility
  const [showScroll, setShowScroll] = useState(false);

  // Check scroll position to toggle button visibility
  useEffect(() => {
    const checkScrollTop = () => {
      if (window.pageYOffset > 400) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, []);

  // Scroll to Top Function
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand & Contact */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
               <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                 <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                 </svg>
               </div>
               <span className="text-2xl font-bold tracking-tighter">
                 Asset<span className="text-amber-500">Farm</span>
               </span>
            </Link>
            <p className="text-gray-400 text-sm">
              Email: <a href="mailto:info@assetfarm.com" className="hover:text-amber-500 transition-colors">info@assetfarm.com</a>
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
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Useful Links</h3>
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
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Our Services</h3>
            <ul className="space-y-4">
              <FooterLink to="/services/forex">Forex Education</FooterLink>
              <FooterLink to="/services/gold">Gold Signals</FooterLink>
              <FooterLink to="/services/indicators">Custom MT4/MT5 Indicators</FooterLink>
              <FooterLink to="/services/bots">Trading Automation</FooterLink>
              <FooterLink to="/services/copy-trading">Elite Copy Trading</FooterLink>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Our Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Join our elite circle. Receive the latest market insights and product updates.
            </p>
            <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-zinc-900 border border-amber-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
              <button 
                type="submit" 
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/10 uppercase tracking-tighter"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} <strong className="text-white">Asset Farm</strong>. All Rights Reserved
          </p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0">
            Designed by <span className="text-amber-500 font-bold">AF Academy</span>
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollTop}
        className={`fixed bottom-8 right-8 bg-amber-500 hover:bg-amber-400 text-black p-3 rounded-full shadow-2xl transition-all duration-300 transform z-50 hover:scale-110 ${showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

// Sub-components for cleaner code
const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-gray-400 hover:text-amber-500 transition-colors flex items-center group">
      <span className="text-amber-500 mr-2 transform group-hover:translate-x-1 transition-transform">›</span> {children}
    </Link>
  </li>
);

const SocialIcon = ({ href, label, children }) => (
  <a 
    href={href} 
    aria-label={label}
    className="w-10 h-10 rounded-full border border-amber-500/20 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-300"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  </a>
);

export default Footer;