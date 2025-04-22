
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    user_phone: '',
    address: '',
    guardian1_name: '',
    guardian1_phone: '',
    guardian2_name: '',
    guardian2_phone: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          user_phone: data.user_phone || '',
          address: data.address || '',
          guardian1_name: data.guardian1_name || '',
          guardian1_phone: data.guardian1_phone || '',
          guardian2_name: data.guardian2_name || '',
          guardian2_phone: data.guardian2_phone || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile data",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('users')
        .update(formData)
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', user?.id);

      if (error) throw error;

      await signOut();
      navigate('/');
      
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted",
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete account",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-black">Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-black">Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="bg-white text-black border-gray-300"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-black">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-white text-black border-gray-300"
              required
            />
          </div>

          <div>
            <Label htmlFor="user_phone" className="text-black">Phone Number</Label>
            <Input
              id="user_phone"
              type="tel"
              value={formData.user_phone}
              onChange={handleChange}
              className="bg-white text-black border-gray-300"
            />
          </div>

          <div>
            <Label htmlFor="address" className="text-black">Address</Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className="bg-white text-black border-gray-300"
            />
          </div>

          <div>
            <Label htmlFor="guardian1_name" className="text-black">Guardian 1 Name</Label>
            <Input
              id="guardian1_name"
              type="text"
              value={formData.guardian1_name}
              onChange={handleChange}
              className="bg-white text-black border-gray-300"
            />
          </div>

          <div>
            <Label htmlFor="guardian1_phone" className="text-black">Guardian 1 Phone</Label>
            <Input
              id="guardian1_phone"
              type="tel"
              value={formData.guardian1_phone}
              onChange={handleChange}
              className="bg-white text-black border-gray-300"
            />
          </div>

          <div>
            <Label htmlFor="guardian2_name" className="text-black">Guardian 2 Name</Label>
            <Input
              id="guardian2_name"
              type="text"
              value={formData.guardian2_name}
              onChange={handleChange}
              className="bg-white text-black border-gray-300"
            />
          </div>

          <div>
            <Label htmlFor="guardian2_phone" className="text-black">Guardian 2 Phone</Label>
            <Input
              id="guardian2_phone"
              type="tel"
              value={formData.guardian2_phone}
              onChange={handleChange}
              className="bg-white text-black border-gray-300"
            />
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] text-white"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount}>
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
