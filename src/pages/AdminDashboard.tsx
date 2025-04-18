
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admin users
  React.useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mb-8">Welcome, {user?.name}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Admin-specific features can be added here */}
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">User Management</h3>
                <p className="text-gray-600 mb-4">Manage user accounts and permissions</p>
                <Button className="w-full bg-gradient-to-r from-[#FC68B3] to-[#FF8A48]">
                  Manage Users
                </Button>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">Analytics</h3>
                <p className="text-gray-600 mb-4">View platform analytics and usage statistics</p>
                <Button className="w-full bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E]">
                  View Analytics
                </Button>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">System Settings</h3>
                <p className="text-gray-600 mb-4">Configure system-wide settings</p>
                <Button className="w-full bg-gradient-to-r from-[#F5DF4D] to-[#FF8A48]">
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default AdminDashboard;
