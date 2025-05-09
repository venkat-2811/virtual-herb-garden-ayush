
import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Leaf } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface HerbViewer3DProps {
  modelUrl?: string;
  herbName: string;
}

// Model component that loads the GLB file
const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  useEffect(() => {
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(interval);
      }
      setLoadingProgress(progress);
    }, 100);
    
    // Clean up resources when unmounting
    return () => {
      clearInterval(interval);
      useGLTF.preload(url);
    };
  }, [url]);
  
  return <primitive object={scene} scale={1.5} position={[0, -0.5, 0]} />;
};

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

// Fallback component to show during loading
const LoadingFallback = () => {
  return (
    <mesh>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshStandardMaterial emissive="#cccccc" wireframe />
    </mesh>
  );
};

const HerbViewer3D: React.FC<HerbViewer3DProps> = ({ modelUrl, herbName }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState<boolean>(false);
  const [progressValue, setProgressValue] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the 3D model with proper status updates
    setLoading(true);
    setError(null);
    
    const timer = setTimeout(() => {
      if (!modelUrl) {
        setError("No 3D model available for this herb");
        setLoading(false);
        return;
      }
      
      // Start progress animation
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 5;
        setProgressValue(Math.min(progress, 90)); // Only go up to 90% until actual load completes
        
        if (progress >= 90) {
          clearInterval(progressInterval);
        }
      }, 100);
      
      // Check if the URL is valid before attempting to load
      fetch(modelUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load 3D model: ${response.statusText}`);
          }
          setModelLoaded(true);
          setProgressValue(100);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error loading 3D model:", err);
          setError(`Could not load 3D model: ${err.message}`);
          setLoading(false);
        })
        .finally(() => {
          clearInterval(progressInterval);
        });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [modelUrl]);

  if (loading) {
    return (
      <div className="w-full h-64 md:h-80 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center">
          <Leaf className="h-12 w-12 text-herb-secondary animate-spin" />
          <p className="mt-4 text-sm text-gray-500">Loading 3D model...</p>
          <div className="w-48 mt-4">
            <Progress value={progressValue} className="h-2" />
          </div>
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
          <Suspense fallback={<LoadingFallback />}>
            <Model url={modelUrl} />
          </Suspense>
        ) : (
          <SimpleLeaf />
        )}
        
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default HerbViewer3D;
