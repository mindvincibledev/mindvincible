
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/context/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, isAuthenticated } = useAuth();
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">
            M(in)dvincible
          </Link>

          {/* Mobile Menu Button */}
          <div className="block md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
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
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-white hover:text-[#3DFDFF] mx-4 transition-colors">
                  Dashboard
                </Link>
                <Link to="/mood-entry" className="text-white hover:text-[#3DFDFF] mx-4 transition-colors">
                  Record Mood
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="ml-2 text-white hover:bg-white/10">
                      <User className="h-4 w-4 mr-2" />
                      {user?.email?.split('@')[0] || 'Account'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black/80 backdrop-blur-lg border-white/10 text-white">
                    <DropdownMenuItem 
                      className="hover:bg-white/10 cursor-pointer"
                      onClick={() => signOut()}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/login">
                <Button variant="default" className="ml-4 bg-gradient-to-r from-[#3DFDFF] to-[#F5DF4D] text-black hover:opacity-90">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md mt-3 py-4 px-2 rounded-lg shadow-lg animate-fade-in border border-white/10">
            <div className="flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="px-4 py-2 hover:bg-white/10 rounded-md transition-colors text-white"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/mood-entry" 
                    className="px-4 py-2 hover:bg-white/10 rounded-md transition-colors text-white"
                  >
                    Record Mood
                  </Link>
                  <button 
                    onClick={() => signOut()} 
                    className="px-4 py-2 hover:bg-white/10 rounded-md transition-colors text-white flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="px-4 py-2 bg-gradient-to-r from-[#3DFDFF] to-[#F5DF4D] text-black hover:opacity-90 rounded-md transition-colors"
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
