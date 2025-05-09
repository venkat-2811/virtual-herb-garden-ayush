
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { User } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user profile
    // For now, just show a toast
    toast.success('Profile updated successfully');
  };
  
  if (!currentUser) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-serif font-bold mb-6">Profile</h1>
        <p>You need to be logged in to view this page.</p>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-serif font-bold mb-2">Your Profile</h1>
      <p className="text-gray-600 mb-8">
        Manage your account settings and preferences.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg border p-6 flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-herb-primary flex items-center justify-center text-white text-2xl font-bold mb-4">
              {currentUser.name.charAt(0)}
            </div>
            <h2 className="text-xl font-semibold">{currentUser.name}</h2>
            <p className="text-gray-500 mb-4">{currentUser.email}</p>
            <span className="inline-flex items-center rounded-full bg-herb-primary/10 px-2 py-1 text-xs font-medium text-herb-primary mb-6">
              {currentUser.role === 'admin' ? 'Administrator' : 'User'}
            </span>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                logout();
                toast.info('Logged out successfully');
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <Button type="submit">Save Changes</Button>
            </form>
            
            <Separator className="my-8" />
            
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive updates about new herbs and features</p>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">Change Password</h3>
                  <p className="text-sm text-gray-500">Update your password regularly for security</p>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h3 className="font-medium text-red-600">Delete Account</h3>
                  <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                </div>
                <div>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
