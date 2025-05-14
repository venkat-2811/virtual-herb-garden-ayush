
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHerbs } from '@/contexts/HerbContext';
import HerbCard from '@/components/HerbCard';
import { supabase } from '@/integrations/supabase/client';
import { Leaf, BookmarkX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const UserCollection: React.FC = () => {
  const { currentUser } = useAuth();
  const { herbs } = useHerbs();
  const [collectionIds, setCollectionIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's collection from Supabase
  useEffect(() => {
    const fetchCollection = async () => {
      if (!currentUser) {
        setCollectionIds([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_collections')
          .select('herb_id')
          .eq('user_id', currentUser.id);

        if (error) throw error;
        
        setCollectionIds(data.map(item => item.herb_id));
      } catch (error) {
        console.error('Error fetching collection:', error);
        toast.error('Failed to load your collection');
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [currentUser]);

  // Get the herbs in user's collection
  const collectionHerbs = herbs.filter(herb => collectionIds.includes(herb.id));

  // Remove herb from collection
  const removeFromCollection = async (herbId: string) => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('user_collections')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('herb_id', herbId);
      
      if (error) throw error;
      
      setCollectionIds(prev => prev.filter(id => id !== herbId));
      toast.success('Removed from your collection');
    } catch (error) {
      console.error('Error removing from collection:', error);
      toast.error('Failed to remove from collection');
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Sign in to view your collection</h2>
        <p className="text-gray-600">
          You need to be logged in to access your personal herb collection.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-4">Your Herb Collection</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Leaf className="h-12 w-12 text-herb-primary animate-spin" />
          <span className="ml-4 text-lg">Loading your collection...</span>
        </div>
      ) : collectionHerbs.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-herb-primary/10 mb-4">
            <Leaf className="h-8 w-8 text-herb-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your collection is empty</h2>
          <p className="text-gray-600 mb-4">
            Start exploring herbs and add them to your collection.
          </p>
          <Button asChild>
            <a href="/explore">Explore Herbs</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collectionHerbs.map((herb) => (
            <div key={herb.id} className="relative">
              <HerbCard herb={herb} />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeFromCollection(herb.id)}
              >
                <BookmarkX className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCollection;
