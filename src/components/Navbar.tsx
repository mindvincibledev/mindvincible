
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Check if user is clinician or admin
  const isClinicianOrAdmin = user && (user.user_type === 0 || user.user_type === 1);

  // Don't show navbar on landing page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-[#FC68B3]" />
            <span className="text-xl font-bold text-gray-800">M(in)dvincible</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/home"
              className="text-gray-700 hover:text-[#FC68B3] transition-colors font-medium"
            >
              Home
            </Link>
            
            {/* Show mood entry only for students */}
            {!isClinicianOrAdmin && (
              <Link
                to="/mood-entry"
                className="text-gray-700 hover:text-[#FC68B3] transition-colors font-medium"
              >
                Mood Entry
              </Link>
            )}
            
            <Link
              to="/journal"
              className="text-gray-700 hover:text-[#FC68B3] transition-colors font-medium"
            >
              Journal
            </Link>
            
            <Link
              to="/emotional-hacking"
              className="text-gray-700 hover:text-[#FC68B3] transition-colors font-medium"
            >
              Activities
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="max-w-24 truncate">{user?.name || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                
                {/* Show dashboard options based on user type */}
                {user?.user_type === 1 && (
                  <DropdownMenuItem asChild>
                    <Link to="/clinician-dashboard" className="flex items-center w-full">
                      <Heart className="mr-2 h-4 w-4" />
                      Clinician Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {user?.user_type === 0 && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin-dashboard" className="flex items-center w-full">
                      <Heart className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link
                to="/home"
                className="text-gray-700 hover:text-[#FC68B3] transition-colors font-medium px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {/* Show mood entry only for students */}
              {!isClinicianOrAdmin && (
                <Link
                  to="/mood-entry"
                  className="text-gray-700 hover:text-[#FC68B3] transition-colors font-medium px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mood Entry
                </Link>
              )}
              
              <Link
                to="/journal"
                className="text-gray-700 hover:text-[#FC68B3] transition-colors font-medium px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Journal
              </Link>
              
              <Link
                to="/emotional-hacking"
                className="text-gray-700 hover:text-[#FC68B3] transition-colors font-medium px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Activities
              </Link>

              <hr className="border-gray-200" />
              
              <Link
                to="/profile"
                className="text-gray-700 hover:text-[#FC68B3] transition-colors font-medium px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
              
              {/* Show dashboard options based on user type */}
              {user?.user_type === 1 && (
                <Link
                  to="/clinician-dashboard"
                  className="text-gray-700 hover:text-[#FC68B3] transition-colors font-medium px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Clinician Dashboard
                </Link>
              )}
              
              {user?.user_type === 0 && (
                <Link
                  to="/admin-dashboard"
                  className="text-gray-700 hover:text-[#FC68B3] transition-colors font-medium px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:text-[#FC68B3] transition-colors font-medium px-2 py-1 text-left"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
