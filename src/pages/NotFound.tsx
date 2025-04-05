
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen flex flex-col relative">
        <Navbar />
        
        <div className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="text-center bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-xl">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white">Page Not Found</h2>
            <p className="text-lg mb-8 max-w-md mx-auto text-white/70">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/">
              <Button size="lg" className="bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:from-[#FF8A48] hover:to-[#FC68B3] text-white">
                <Home className="mr-2 h-5 w-5" /> Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default NotFound;
