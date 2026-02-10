import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll'; // Import from react-scroll
import { animateScroll as scroll } from 'react-scroll';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo - Scrolls to Top */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => scroll.scrollToTop()}>
             <div className="flex items-center gap-2 group">
              {/* Replace with your actual image path */}
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-10 w-auto object-contain" 
              />
              <div className="flex flex-col">
                <span className={`font-bold text-2xl leading-none ${scrolled ? 'text-gray-900' : 'text-white'} transition-colors`}>
                  Asset<span className="text-green-500"> Farm</span>
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="home" scrolled={scrolled}>Home</NavLink>
            <NavLink to="about" scrolled={scrolled}>About</NavLink>
            <NavLink to="courses" scrolled={scrolled}>Courses</NavLink>
            <NavLink to="services" scrolled={scrolled}>Services</NavLink>
            <NavLink to="team" scrolled={scrolled}>Team</NavLink>
            <NavLink to="contact" scrolled={scrolled}>Contact</NavLink>
            
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className={`p-2 rounded-md ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              <span className="sr-only">Open menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden bg-white absolute w-full transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 shadow-xl' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-4 pb-6 space-y-2">
          <MobileNavLink to="home" onClick={toggleMenu}>Home</MobileNavLink>
          <MobileNavLink to="about" onClick={toggleMenu}>About</MobileNavLink>
          <MobileNavLink to="courses" onClick={toggleMenu}>Courses</MobileNavLink>
          <MobileNavLink to="services" onClick={toggleMenu}>Services</MobileNavLink>
          <MobileNavLink to="team" onClick={toggleMenu}>Team</MobileNavLink>
          <MobileNavLink to="contact" onClick={toggleMenu}>Contact</MobileNavLink>
        </div>
      </div>
    </nav>
  );
};

// Desktop NavLink Component
const NavLink = ({ to, children, scrolled }) => (
  <ScrollLink
    to={to}
    spy={true}
    smooth={true}
    offset={-80} // Adjust for navbar height
    duration={500}
    className={`cursor-pointer text-sm font-medium transition-colors relative group ${scrolled ? 'text-gray-700 hover:text-green-600' : 'text-gray-200 hover:text-white'}`}
    activeClass="!text-green-500 font-bold" // Class applied when section is active
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
  </ScrollLink>
);

// Mobile NavLink Component
const MobileNavLink = ({ to, children, onClick }) => (
  <ScrollLink
    to={to}
    spy={true}
    smooth={true}
    offset={-80}
    duration={500}
    onClick={onClick}
    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 font-medium cursor-pointer"
    activeClass="bg-green-50 text-green-600 font-bold"
  >
    {children}
  </ScrollLink>
);

export default NavBar;
