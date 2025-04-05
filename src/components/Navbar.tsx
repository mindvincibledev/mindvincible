
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was a problem logging you out. Please try again.",
      });
    }
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
                <Link to="/dashboard" className="text-foreground hover:text-primary mx-4">
                  Dashboard
                </Link>
                <Link to="/mood-entry" className="text-foreground hover:text-primary mx-4">
                  Mood Entry
                </Link>
                <Button 
                  className="ml-4 flex items-center gap-2 bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:opacity-90 text-white" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              location.pathname !== '/login' && (
                <Link to="/login">
                  <Button variant="default" className="ml-4">
                    Login
                  </Button>
                </Link>
              )
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
                    className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/mood-entry" 
                    className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mood Entry
                  </Link>
                  <button 
                    className="px-4 py-2 text-left text-white bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:opacity-90 rounded-md transition-colors flex items-center"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                location.pathname !== '/login' && (
                  <Link 
                    to="/login" 
                    className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
