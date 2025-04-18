
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Button } from '@/components/ui/button';

const ClinicianDashboard = () => {
  const { user, isClinician } = useAuth();
  const navigate = useNavigate();

  // Redirect non-clinician users
  React.useEffect(() => {
    if (!isClinician()) {
      navigate('/dashboard');
    }
  }, [isClinician, navigate]);

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
              Clinician Dashboard
            </h1>
            <p className="text-gray-600 mb-8">Welcome, {user?.name}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">Student Management</h3>
                <p className="text-gray-600 mb-4">View and manage your students</p>
                <Button className="w-full bg-gradient-to-r from-[#FC68B3] to-[#FF8A48]">
                  Manage Students
                </Button>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">Progress Reports</h3>
                <p className="text-gray-600 mb-4">View student progress and generate reports</p>
                <Button className="w-full bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E]">
                  View Reports
                </Button>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">Communication</h3>
                <p className="text-gray-600 mb-4">Communicate with students and guardians</p>
                <Button className="w-full bg-gradient-to-r from-[#F5DF4D] to-[#FF8A48]">
                  Messages
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default ClinicianDashboard;
