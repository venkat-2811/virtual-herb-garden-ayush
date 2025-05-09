
import React, { useEffect, useState } from 'react';
import { useHerbs } from '@/contexts/HerbContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SearchFilters as SearchFiltersType } from '@/types';
import { X, Search } from 'lucide-react';

interface SearchFiltersProps {
  className?: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ className }) => {
  const { herbs, searchFilters, setSearchFilters } = useHerbs();
  
  // Extract unique values for filter options
  const [regions, setRegions] = useState<string[]>([]);
  const [uses, setUses] = useState<string[]>([]);
  const [compositions, setCompositions] = useState<string[]>([]);
  
  useEffect(() => {
    // Extract unique regions, uses, and compositions from herbs
    const uniqueRegions = new Set<string>();
    const uniqueUses = new Set<string>();
    const uniqueCompositions = new Set<string>();
    
    herbs.forEach(herb => {
      herb.region.forEach(r => uniqueRegions.add(r));
      herb.uses.forEach(u => uniqueUses.add(u));
      herb.composition.forEach(c => uniqueCompositions.add(c));
    });
    
    setRegions(Array.from(uniqueRegions).sort());
    setUses(Array.from(uniqueUses).sort());
    setCompositions(Array.from(uniqueCompositions).sort());
  }, [herbs]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilters(prev => ({ ...prev, query: e.target.value }));
  };
  
  const handleRegionChange = (value: string) => {
    if (!value) return;
    
    setSearchFilters(prev => {
      if (prev.regions.includes(value)) {
        return prev;
      }
      return { ...prev, regions: [...prev.regions, value] };
    });
  };
  
  const handleUseChange = (value: string) => {
    if (!value) return;
    
    setSearchFilters(prev => {
      if (prev.uses.includes(value)) {
        return prev;
      }
      return { ...prev, uses: [...prev.uses, value] };
    });
  };
  
  const handleCompositionChange = (value: string) => {
    if (!value) return;
    
    setSearchFilters(prev => {
      if (prev.compositions.includes(value)) {
        return prev;
      }
      return { ...prev, compositions: [...prev.compositions, value] };
    });
  };
  
  const removeRegion = (region: string) => {
    setSearchFilters(prev => ({
      ...prev,
      regions: prev.regions.filter(r => r !== region)
    }));
  };
  
  const removeUse = (use: string) => {
    setSearchFilters(prev => ({
      ...prev,
      uses: prev.uses.filter(u => u !== use)
    }));
  };
  
  const removeComposition = (composition: string) => {
    setSearchFilters(prev => ({
      ...prev,
      compositions: prev.compositions.filter(c => c !== composition)
    }));
  };
  
  const resetFilters = () => {
    setSearchFilters({
      query: '',
      regions: [],
      uses: [],
      compositions: []
    });
  };
  
  const hasActiveFilters = searchFilters.query.length > 0 || 
    searchFilters.regions.length > 0 || 
    searchFilters.uses.length > 0 || 
    searchFilters.compositions.length > 0;
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search for herbs..."
          value={searchFilters.query}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select onValueChange={handleRegionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by region" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Regions</SelectLabel>
              {regions.map(region => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Select onValueChange={handleUseChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by use" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Uses</SelectLabel>
              {uses.map(use => (
                <SelectItem key={use} value={use}>
                  {use}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Select onValueChange={handleCompositionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by composition" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Compositions</SelectLabel>
              {compositions.map(composition => (
                <SelectItem key={composition} value={composition}>
                  {composition}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      {hasActiveFilters && (
        <div>
          <div className="flex flex-wrap gap-2 mt-2">
            {searchFilters.regions.map(region => (
              <Badge key={region} variant="secondary" className="flex items-center gap-1">
                {region}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeRegion(region)} 
                />
              </Badge>
            ))}
            
            {searchFilters.uses.map(use => (
              <Badge key={use} variant="secondary" className="flex items-center gap-1">
                {use}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeUse(use)} 
                />
              </Badge>
            ))}
            
            {searchFilters.compositions.map(composition => (
              <Badge key={composition} variant="secondary" className="flex items-center gap-1">
                {composition}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeComposition(composition)} 
                />
              </Badge>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="mt-2 text-xs"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
