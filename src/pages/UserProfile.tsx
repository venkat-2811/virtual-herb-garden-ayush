
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Profile from './Profile';
import UserCollection from '@/components/UserCollection';

const UserProfile: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-serif font-bold mb-2">Your Account</h1>
      <p className="text-gray-600 mb-8">
        Manage your personal information and herb collection.
      </p>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          <TabsTrigger value="collection">Your Collection</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <Profile />
        </TabsContent>
        <TabsContent value="collection" className="mt-6">
          <UserCollection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
