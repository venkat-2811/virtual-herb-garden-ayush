
import React from 'react';
import { Link } from 'react-router-dom';
import { Herb } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Leaf } from 'lucide-react';

interface HerbCardProps {
  herb: Herb;
}

const HerbCard: React.FC<HerbCardProps> = ({ herb }) => {
  // Find the primary image or use the first one
  const primaryImage = herb.images?.find(img => img.isPrimary) || herb.images?.[0];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="h-48 overflow-hidden relative">
        {primaryImage ? (
          <img 
            src={primaryImage.url || '/placeholder.svg'} 
            alt={primaryImage.alt || herb.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Leaf className="h-12 w-12 text-gray-300" />
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{herb.name}</CardTitle>
        <CardDescription className="italic">{herb.scientificName}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm line-clamp-3">
          {herb.description || 'No description available.'}
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          {herb.region && herb.region.slice(0, 2).map(region => (
            <span 
              key={region} 
              className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
            >
              {region}
            </span>
          ))}
          {herb.region && herb.region.length > 2 && (
            <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700">
              +{herb.region.length - 2}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {herb.uses?.length || 0} uses
          </div>
          <Button asChild>
            <Link to={`/herbs/${herb.id}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default HerbCard;
