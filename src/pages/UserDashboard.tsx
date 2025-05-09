
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHerbs } from '@/contexts/HerbContext';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import HerbCard from '@/components/HerbCard';
import { Leaf, Search, Book, ArrowRight } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { herbs, loading } = useHerbs();
  
  // Get featured herbs (for now, just random selection)
  const featuredHerbs = herbs.slice(0, 3);
  
  // Stats
  const totalHerbs = herbs.length;
  const regionsCount = new Set(herbs.flatMap(herb => herb.region)).size;
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-serif font-bold mb-2">Welcome, {currentUser?.name}</h1>
      <p className="text-gray-600 mb-8">
        Explore the virtual herbal garden and discover the healing power of medicinal herbs.
      </p>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-2xl font-bold">Herbal Library</CardTitle>
            <Leaf className="h-6 w-6 text-herb-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-herb-primary">{totalHerbs}</div>
            <p className="text-sm text-gray-500 mt-2">Medicinal herbs in our database</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/explore">
                Explore All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-2xl font-bold">Regions</CardTitle>
            <Search className="h-6 w-6 text-herb-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-herb-primary">{regionsCount}</div>
            <p className="text-sm text-gray-500 mt-2">Geographic regions represented</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/explore">
                Filter by Region <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-2xl font-bold">Herbal Assistant</CardTitle>
            <Book className="h-6 w-6 text-herb-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-herb-primary">AI</div>
            <p className="text-sm text-gray-500 mt-2">Ask questions about herbs and their uses</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/chat">
                Start Chatting <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Featured Herbs */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold">Featured Herbs</h2>
          <Button variant="ghost" asChild>
            <Link to="/explore" className="text-herb-primary flex items-center">
              View all herbs <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading herbs...</p>
          ) : (
            featuredHerbs.map((herb) => <HerbCard key={herb.id} herb={herb} />)
          )}
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="bg-herb-primary/10 rounded-xl p-6">
        <h2 className="text-2xl font-serif font-bold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="flex items-center justify-center gap-2 h-16" asChild>
            <Link to="/explore">
              <Search className="h-5 w-5" />
              Explore Herbs
            </Link>
          </Button>
          <Button className="flex items-center justify-center gap-2 h-16" asChild>
            <Link to="/chat">
              <Book className="h-5 w-5" />
              Chat with Assistant
            </Link>
          </Button>
          <Button className="flex items-center justify-center gap-2 h-16" asChild>
            <Link to="/3d-garden">
              <Leaf className="h-5 w-5" />
              3D Garden
            </Link>
          </Button>
          <Button className="flex items-center justify-center gap-2 h-16" asChild>
            <Link to="/profile">
              <Leaf className="h-5 w-5" />
              Your Profile
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
