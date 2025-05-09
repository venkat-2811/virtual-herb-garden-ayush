
import React, { useState } from 'react';
import { useHerbs } from '@/contexts/HerbContext';
import HerbCard from '@/components/HerbCard';
import SearchFilters from '@/components/SearchFilters';
import { Leaf } from 'lucide-react';

const Explore: React.FC = () => {
  const { filteredHerbs, loading } = useHerbs();
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">
          Explore Medicinal Herbs
        </h1>
        <p className="text-gray-600">
          Discover traditional medicinal herbs from around the world. Use the filters to find herbs by region, use case, or composition.
        </p>
      </div>
      
      <div className="mb-8">
        <SearchFilters />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Leaf className="h-12 w-12 text-herb-primary animate-spin" />
          <span className="ml-4 text-lg">Loading herbs...</span>
        </div>
      ) : filteredHerbs.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-herb-primary/10 mb-4">
            <Leaf className="h-8 w-8 text-herb-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No herbs found</h2>
          <p className="text-gray-600">
            Try adjusting your search filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredHerbs.map((herb) => (
            <HerbCard key={herb.id} herb={herb} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
