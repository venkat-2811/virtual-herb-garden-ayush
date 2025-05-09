
import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Leaf } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface HerbViewer3DProps {
  modelUrl?: string;
  herbName: string;
}

// Basic leaf component for fallback
const SimpleLeaf = () => {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial emissive="#4a7c59" />
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.5, 8]} />
        <meshStandardMaterial emissive="#8cb369" />
      </mesh>
    </mesh>
  );
};

const HerbViewer3D: React.FC<HerbViewer3DProps> = ({ modelUrl, herbName }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading the 3D model
    const timer = setTimeout(() => {
      if (!modelUrl) {
        setError("No 3D model available for this herb");
      }
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [modelUrl]);

  if (loading) {
    return (
      <div className="w-full h-64 md:h-80 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center">
          <Leaf className="h-12 w-12 text-herb-secondary animate-spin" />
          <p className="mt-4 text-sm text-gray-500">Loading 3D model...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <Alert variant="default" className="bg-muted/50">
          <Leaf className="h-4 w-4" />
          <AlertTitle>3D Model Not Available</AlertTitle>
          <AlertDescription>
            A 3D model for {herbName} is not yet available. Our team is working on adding more models to the garden.
          </AlertDescription>
        </Alert>
        <div className="w-full h-64 md:h-80 mt-4 flex items-center justify-center bg-gray-50 rounded-lg">
          <Canvas>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <SimpleLeaf />
            <OrbitControls />
          </Canvas>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-64 md:h-80 rounded-lg overflow-hidden border border-gray-200">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        {modelUrl ? (
          <mesh>
            {/* In a real implementation, we would load the GLB model here */}
            <SimpleLeaf />
          </mesh>
        ) : (
          <SimpleLeaf />
        )}
        
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default HerbViewer3D;
