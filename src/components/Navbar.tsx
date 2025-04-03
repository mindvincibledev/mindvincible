
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            M(in)dvincible
          </Link>

          {/* Mobile Menu Button */}
          <div className="block md:hidden">
            <button
              onClick={toggleMenu}
              className="text-foreground focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-foreground hover:text-primary mx-4 ${location.pathname === '/dashboard' ? 'text-primary font-medium' : ''}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/mood-entry" 
                  className={`text-foreground hover:text-primary mx-4 ${location.pathname === '/mood-entry' ? 'text-primary font-medium' : ''}`}
                >
                  Log Mood
                </Link>
                <Button 
                  variant="outline" 
                  className="ml-4 border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="default" className="ml-4">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white bg-opacity-95 backdrop-blur-md mt-3 py-4 px-2 rounded-lg shadow-lg animate-fade-in">
            <div className="flex flex-col space-y-4">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`px-4 py-2 hover:bg-gray-100 rounded-md transition-colors ${location.pathname === '/dashboard' ? 'text-primary font-medium' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/mood-entry" 
                    className={`px-4 py-2 hover:bg-gray-100 rounded-md transition-colors ${location.pathname === '/mood-entry' ? 'text-primary font-medium' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log Mood
                  </Link>
                  <button 
                    className="px-4 py-2 text-left flex items-center text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
