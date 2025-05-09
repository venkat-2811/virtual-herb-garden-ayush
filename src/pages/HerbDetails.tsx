
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useHerbs } from '@/contexts/HerbContext';
import { useAuth } from '@/contexts/AuthContext';
import HerbViewer3D from '@/components/HerbViewer3D';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf, 
  ArrowLeft, 
  Edit, 
  MapPin, 
  Bookmark, 
  ClipboardList, 
  FlaskConical,
  Upload
} from 'lucide-react';

const HerbDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getHerbById, loading } = useHerbs();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [herb, setHerb] = useState(() => {
    if (!id) return null;
    return getHerbById(id);
  });
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  useEffect(() => {
    if (!herb && id && !loading) {
      // If herb not found, redirect to explore page
      navigate('/explore', { replace: true });
    }
  }, [herb, id, loading, navigate]);
  
  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <Leaf className="h-12 w-12 text-herb-primary animate-spin" />
        <span className="ml-4 text-lg">Loading herb details...</span>
      </div>
    );
  }
  
  if (!herb) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Herb not found</h2>
          <p className="text-gray-600 mb-4">
            The herb you're looking for doesn't exist in our database.
          </p>
          <Button asChild>
            <Link to="/explore">Back to Explore</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Find the primary image or use the first one
  const images = herb.images || [];
  const primaryImage = images.find(img => img.isPrimary) || images[0];
  const activeImage = images[activeImageIndex] || primaryImage;
  
  return (
    <div className="container py-8">
      {/* Back button and herb name */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <Button variant="ghost" className="mb-4 pl-0" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-3xl md:text-4xl font-serif font-bold">{herb.name}</h1>
          <p className="text-lg italic text-muted-foreground">{herb.scientificName}</p>
        </div>
        
        {isAdmin && (
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button asChild variant="outline">
              <Link to={`/admin/herbs/${herb.id}/upload`}>
                <Upload className="mr-2 h-4 w-4" /> Upload Files
              </Link>
            </Button>
            <Button asChild>
              <Link to={`/admin/herbs/${herb.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit Herb
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column: Images and 3D model */}
        <div>
          <div className="mb-6">
            {activeImage ? (
              <div className="aspect-square overflow-hidden rounded-lg border">
                <img 
                  src={activeImage.url || '/placeholder.svg'} 
                  alt={activeImage.alt || herb.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square overflow-hidden rounded-lg border bg-gray-100 flex items-center justify-center">
                <Leaf className="h-16 w-16 text-gray-300" />
              </div>
            )}
            
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                      index === activeImageIndex 
                        ? 'border-herb-primary' 
                        : 'border-transparent'
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.alt || `${herb.name} image ${index+1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">3D Model</h2>
            <HerbViewer3D modelUrl={herb.model3dUrl} herbName={herb.name} />
          </div>
        </div>
        
        {/* Right column: Herb details */}
        <div>
          <Tabs defaultValue="overview">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="uses" className="flex-1">Uses & Benefits</TabsTrigger>
              <TabsTrigger value="composition" className="flex-1">Composition</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {herb.description || 'No description available.'}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center mb-2">
                    <MapPin className="h-5 w-5 text-herb-primary mr-2" />
                    <h2 className="text-xl font-semibold">Native Regions</h2>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {herb.region && herb.region.length > 0 ? herb.region.map(region => (
                      <Badge key={region} variant="outline">
                        {region}
                      </Badge>
                    )) : (
                      <p className="text-muted-foreground text-sm">No regions specified</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="uses" className="pt-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-4">
                    <ClipboardList className="h-5 w-5 text-herb-primary mr-2" />
                    <h2 className="text-xl font-semibold">Medicinal Uses</h2>
                  </div>
                  
                  {herb.uses && herb.uses.length > 0 ? (
                    <ul className="space-y-3">
                      {herb.uses.map((use, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-herb-primary/10 text-herb-primary text-sm mr-2">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{use}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-sm">No uses specified</p>
                  )}
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Leaf className="h-5 w-5 mr-2 text-herb-primary" />
                      Traditional Knowledge
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This herb has been used traditionally for centuries in various healing practices. 
                      The information provided is based on traditional knowledge and modern research.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="composition" className="pt-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-4">
                    <FlaskConical className="h-5 w-5 text-herb-primary mr-2" />
                    <h2 className="text-xl font-semibold">Chemical Composition</h2>
                  </div>
                  
                  {herb.composition && herb.composition.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {herb.composition.map((component, index) => (
                        <div key={index} className="bg-muted/50 p-4 rounded-lg">
                          <p className="font-medium">{component}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Active component
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No composition data available</p>
                  )}
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        The information provided is for educational purposes only and should not replace professional medical advice. Always consult with a healthcare provider before using any herb medicinally.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default HerbDetails;
