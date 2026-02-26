// src/Components/NavBar.jsx
import React, { useState, useEffect } from 'react';
import { Link as ScrollLink, animateScroll as scroll, scroller } from 'react-scroll';
import { useLocation, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(prev => !prev);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to a section on the Home page
  const scrollToSection = (sectionId) => {
    scroller.scrollTo(sectionId, {
      duration: 500,
      smooth: true,
      offset: -80,
    });
  };

  // From other pages: go to "/" then scroll to section
  const goToHomeAndScroll = (sectionId) => {
    setIsOpen(false);
    if (location.pathname === '/') {
      scrollToSection(sectionId);
    } else {
      navigate('/');
      // wait a bit so Home renders, then scroll
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 300);
    }
  };

  const goToCareers = () => {
    setIsOpen(false);
    navigate('/careers');
  };

  const isHome = location.pathname === '/';

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - scroll to top of current page OR go home */}
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => {
              setIsOpen(false);
              if (isHome) {
                scroll.scrollToTop();
              } else {
                navigate('/');
              }
            }}
          >
            <div className="flex items-center gap-2 group">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-10 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span
                  className={`font-bold text-2xl leading-none transition-colors ${
                    scrolled ? 'text-gray-900' : 'text-white'
                  }`}
                >
                  Asset<span className="text-green-500"> Farm</span>
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* When on "/", use react-scroll; otherwise navigate then scroll */}
            {isHome ? (
              <>
                <NavLink to="home" scrolled={scrolled}>
                  Home
                </NavLink>
                <NavLink to="about" scrolled={scrolled}>
                  About
                </NavLink>
                <NavLink to="courses" scrolled={scrolled}>
                  Courses
                </NavLink>
                <NavLink to="services" scrolled={scrolled}>
                  Services
                </NavLink>
                <NavLink to="team" scrolled={scrolled}>
                  Team
                </NavLink>
                <NavLink to="contact" scrolled={scrolled}>
                  Contact
                </NavLink>
              </>
            ) : (
              <>
                <SimpleLink label="Home" scrolled={scrolled} onClick={() => goToHomeAndScroll('home')} />
                <SimpleLink label="About" scrolled={scrolled} onClick={() => goToHomeAndScroll('about')} />
                <SimpleLink label="Courses" scrolled={scrolled} onClick={() => goToHomeAndScroll('courses')} />
                <SimpleLink label="Services" scrolled={scrolled} onClick={() => goToHomeAndScroll('services')} />
                <SimpleLink label="Team" scrolled={scrolled} onClick={() => goToHomeAndScroll('team')} />
                <SimpleLink label="Contact" scrolled={scrolled} onClick={() => goToHomeAndScroll('contact')} />
              </>
            )}

            {/* Careers -> separate route */}
            <button
              type="button"
              onClick={goToCareers}
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? 'text-gray-700 hover:text-green-600'
                  : 'text-gray-200 hover:text-white'
              }`}
            >
              Careers
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-md ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden bg-white absolute w-full transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 shadow-xl' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2">
          {isHome ? (
            <>
              <MobileNavLink to="home" onClick={toggleMenu}>
                Home
              </MobileNavLink>
              <MobileNavLink to="about" onClick={toggleMenu}>
                About
              </MobileNavLink>
              <MobileNavLink to="courses" onClick={toggleMenu}>
                Courses
              </MobileNavLink>
              <MobileNavLink to="services" onClick={toggleMenu}>
                Services
              </MobileNavLink>
              <MobileNavLink to="team" onClick={toggleMenu}>
                Team
              </MobileNavLink>
              <MobileNavLink to="contact" onClick={toggleMenu}>
                Contact
              </MobileNavLink>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => goToHomeAndScroll('home')}
                className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 font-medium"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => goToHomeAndScroll('about')}
                className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 font-medium"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => goToHomeAndScroll('courses')}
                className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 font-medium"
              >
                Courses
              </button>
              <button
                type="button"
                onClick={() => goToHomeAndScroll('services')}
                className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 font-medium"
              >
                Services
              </button>
              <button
                type="button"
                onClick={() => goToHomeAndScroll('team')}
                className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 font-medium"
              >
                Team
              </button>
              <button
                type="button"
                onClick={() => goToHomeAndScroll('contact')}
                className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 font-medium"
              >
                Contact
              </button>
            </>
          )}

          {/* Careers in mobile dropdown */}
          <button
            type="button"
            onClick={goToCareers}
            className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 font-medium"
          >
            Careers
          </button>
        </div>
      </div>
    </nav>
  );
};

// Desktop NavLink Component (only used on "/" with react-scroll)
const NavLink = ({ to, children, scrolled }) => (
  <ScrollLink
    to={to}
    spy={true}
    smooth={true}
    offset={-80}
    duration={500}
    className={`cursor-pointer text-sm font-medium transition-colors relative group ${
      scrolled
        ? 'text-gray-700 hover:text-green-600'
        : 'text-gray-200 hover:text-white'
    }`}
    activeClass="!text-green-500 font-bold"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
  </ScrollLink>
);

// Desktop simple button-style link for non-home routes
const SimpleLink = ({ label, scrolled, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-sm font-medium transition-colors ${
      scrolled
        ? 'text-gray-700 hover:text-green-600'
        : 'text-gray-200 hover:text-white'
    }`}
  >
    {label}
  </button>
);

// Mobile NavLink Component (used only on "/")
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
