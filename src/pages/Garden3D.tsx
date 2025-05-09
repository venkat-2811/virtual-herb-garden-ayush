
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useHerbs } from '@/contexts/HerbContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Basic plant component for garden
const Plant = ({ position, color, scale = 1 }: { position: [number, number, number], color: string, scale?: number }) => {
  return (
    <group position={position} scale={scale}>
      {/* Stem */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
        <meshStandardMaterial emissive="#4a7c59" />
      </mesh>
      
      {/* Leaves */}
      <mesh position={[0.2, 0.8, 0]} rotation={[0, 0, Math.PI / 6]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial emissive={color} />
      </mesh>
      
      <mesh position={[-0.2, 0.7, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial emissive={color} />
      </mesh>
      
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial emissive={color} />
      </mesh>
    </group>
  );
};

// Ground plane
const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial emissive="#8cb369" />
    </mesh>
  );
};

// 3D Garden Scene
const GardenScene = () => {
  const plantPositions = [
    { pos: [-2, 0, -2], color: "#4a7c59", scale: 1.2 },
    { pos: [2, 0, -1], color: "#8cb369", scale: 0.8 },
    { pos: [0, 0, 0], color: "#4a7c59", scale: 1 },
    { pos: [-1.5, 0, 1.5], color: "#8cb369", scale: 0.9 },
    { pos: [1.5, 0, 2], color: "#4a7c59", scale: 1.1 },
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <Ground />
      {plantPositions.map((plant, i) => (
        <Plant 
          key={i} 
          position={plant.pos as [number, number, number]} 
          color={plant.color}
          scale={plant.scale} 
        />
      ))}
      <OrbitControls />
    </>
  );
};

const Garden3D: React.FC = () => {
  const { herbs } = useHerbs();
  
  // Get herbs with 3D models
  const herbsWith3D = herbs.filter(herb => herb.model3dUrl);
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-serif font-bold mb-2">3D Virtual Garden</h1>
      <p className="text-gray-600 mb-8">
        Explore medicinal herbs in our virtual 3D garden. Click on a plant to learn more about its properties and uses.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-muted/20 border rounded-lg overflow-hidden">
            <div className="aspect-[16/9] w-full">
              <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
                <GardenScene />
              </Canvas>
            </div>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Garden Exploration</CardTitle>
                <CardDescription>
                  Use mouse controls to navigate around the garden.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-herb-primary/20 text-herb-primary mr-3">
                      1
                    </span>
                    <span>Click and drag to rotate the view</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-herb-primary/20 text-herb-primary mr-3">
                      2
                    </span>
                    <span>Scroll to zoom in and out</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-herb-primary/20 text-herb-primary mr-3">
                      3
                    </span>
                    <span>Right-click and drag to pan the camera</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Featured Herbs</CardTitle>
              <CardDescription>Herbs with 3D models available</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {herbsWith3D.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No herbs with 3D models are currently available. Check back later or browse our catalog.
                  </p>
                ) : (
                  herbsWith3D.map(herb => (
                    <div key={herb.id} className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                        {herb.images.length > 0 ? (
                          <img 
                            src={herb.images[0].url} 
                            alt={herb.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-herb-primary/20" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{herb.name}</p>
                        <p className="text-xs text-gray-500">{herb.scientificName}</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/herbs/${herb.id}`}>View</Link>
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/explore">
                  Explore All Herbs <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>About the 3D Garden</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                The AYUSH Virtual Herbal Garden provides an immersive way to explore and learn about medicinal herbs. Our 3D models allow you to examine plants from all angles and understand their structure.
              </p>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Note: This feature is currently in beta. More plants and interaction features will be added soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Garden3D;
