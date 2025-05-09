
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useHerbs } from '@/contexts/HerbContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Upload, X, Image, Leaf, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Maximum allowed file sizes in bytes
const MAX_MODEL_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const AdminUpload: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getHerbById, uploadHerbModel, uploadHerbImages, loading } = useHerbs();
  
  const herb = id ? getHerbById(id) : null;
  
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadingModel, setUploadingModel] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<{model?: string, images?: string}>({});
  
  if (!herb) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-serif font-bold mb-6">Herb Not Found</h1>
        <p className="mb-4">The herb you're trying to upload files for does not exist.</p>
        <Button asChild>
          <Link to="/admin/herbs">Back to Herbs</Link>
        </Button>
      </div>
    );
  }
  
  const validateModelFile = (file: File | null): boolean => {
    if (!file) {
      setValidationErrors(prev => ({ ...prev, model: undefined }));
      return false;
    }
    
    // Check file extension
    const isGlb = file.name.toLowerCase().endsWith('.glb');
    if (!isGlb) {
      setValidationErrors(prev => ({ ...prev, model: 'Only .glb files are allowed' }));
      return false;
    }
    
    // Check file size
    if (file.size > MAX_MODEL_SIZE) {
      setValidationErrors(prev => ({ ...prev, model: `File size exceeds maximum allowed (${MAX_MODEL_SIZE / (1024 * 1024)}MB)` }));
      return false;
    }
    
    setValidationErrors(prev => ({ ...prev, model: undefined }));
    return true;
  };
  
  const validateImageFiles = (files: File[]): boolean => {
    if (files.length === 0) {
      setValidationErrors(prev => ({ ...prev, images: undefined }));
      return false;
    }
    
    // Check if all files are images
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const areAllImages = files.every(file => validImageTypes.includes(file.type));
    
    if (!areAllImages) {
      setValidationErrors(prev => ({ ...prev, images: 'Only JPG, JPEG, and PNG files are allowed' }));
      return false;
    }
    
    // Check if any file exceeds the max size
    const anyFileTooLarge = files.some(file => file.size > MAX_IMAGE_SIZE);
    if (anyFileTooLarge) {
      setValidationErrors(prev => ({ ...prev, images: `One or more files exceed maximum allowed size (${MAX_IMAGE_SIZE / (1024 * 1024)}MB)` }));
      return false;
    }
    
    setValidationErrors(prev => ({ ...prev, images: undefined }));
    return true;
  };
  
  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setModelFile(file);
      validateModelFile(file);
    }
  };
  
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setImageFiles(prev => {
        const newFiles = [...prev, ...filesArray];
        validateImageFiles(newFiles);
        return newFiles;
      });
    }
  };
  
  const removeImage = (index: number) => {
    setImageFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      validateImageFiles(newFiles);
      return newFiles;
    });
  };
  
  const simulateProgress = () => {
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress(progress);
    }, 300);
    
    return () => clearInterval(interval);
  };
  
  const handleUploadModel = async () => {
    if (!modelFile) {
      toast.error('Please select a model file');
      return;
    }
    
    if (!validateModelFile(modelFile)) {
      toast.error(validationErrors.model || 'Invalid model file');
      return;
    }
    
    try {
      setUploadingModel(true);
      setUploadProgress(0);
      
      // Start progress simulation
      const clearProgressInterval = simulateProgress();
      
      await uploadHerbModel(herb.id, modelFile);
      
      // Ensure progress reaches 100%
      setUploadProgress(100);
      clearProgressInterval();
      
      toast.success('3D model uploaded successfully');
      setModelFile(null);
      
      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error) {
      toast.error('Failed to upload 3D model');
      console.error('Error uploading model:', error);
    } finally {
      setUploadingModel(false);
    }
  };
  
  const handleUploadImages = async () => {
    if (imageFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }
    
    if (!validateImageFiles(imageFiles)) {
      toast.error(validationErrors.images || 'Invalid image files');
      return;
    }
    
    try {
      setUploadingImages(true);
      setUploadProgress(0);
      
      // Start progress simulation
      const clearProgressInterval = simulateProgress();
      
      await uploadHerbImages(herb.id, imageFiles);
      
      // Ensure progress reaches 100%
      setUploadProgress(100);
      clearProgressInterval();
      
      toast.success('Images uploaded successfully');
      setImageFiles([]);
      
      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error) {
      toast.error('Failed to upload images');
      console.error('Error uploading images:', error);
    } finally {
      setUploadingImages(false);
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  
  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-4 pl-0" onClick={() => navigate('/admin/herbs')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Herbs
      </Button>
      
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold">
          Upload Files for {herb.name}
        </h1>
        <p className="text-gray-600 mt-2">
          Upload 3D models (GLB) and images (JPG, JPEG, PNG) for this herb.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 3D Model Upload */}
        <div className="p-6 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Upload 3D Model</h2>
          <p className="text-gray-600 mb-4">
            Upload a GLB format 3D model of the herb (max size: {MAX_MODEL_SIZE / (1024 * 1024)}MB). This will be used in the virtual garden.
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model">Select 3D Model (GLB format)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="model"
                  type="file"
                  accept=".glb"
                  onChange={handleModelChange}
                  className="flex-1"
                  disabled={uploadingModel}
                />
              </div>
              {validationErrors.model && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" /> {validationErrors.model}
                </p>
              )}
            </div>
            
            {modelFile && (
              <div className="p-4 border rounded-md bg-muted/20 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5 text-herb-primary" />
                  <span className="font-medium">{modelFile.name}</span>
                  <span className="text-sm text-gray-500">
                    ({formatFileSize(modelFile.size)})
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setModelFile(null)}
                  disabled={uploadingModel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {uploadingModel && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                onClick={handleUploadModel}
                disabled={!modelFile || uploadingModel || !!validationErrors.model}
                className="w-full"
              >
                {uploadingModel ? (
                  <>
                    <Leaf className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload 3D Model
                  </>
                )}
              </Button>
            </div>
            
            {herb.model3dUrl && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800 flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  This herb already has a 3D model. Uploading a new one will replace it.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
        
        {/* Images Upload */}
        <div className="p-6 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
          <p className="text-gray-600 mb-4">
            Upload high-quality images (JPG, JPEG, PNG) of the herb (max size: {MAX_IMAGE_SIZE / (1024 * 1024)}MB per image). These will be displayed in the herb details page.
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="images">Select Images</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="images"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  multiple
                  onChange={handleImagesChange}
                  className="flex-1"
                  disabled={uploadingImages}
                />
              </div>
              {validationErrors.images && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" /> {validationErrors.images}
                </p>
              )}
            </div>
            
            {imageFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Images ({imageFiles.length})</Label>
                <div className="grid grid-cols-2 gap-2">
                  {imageFiles.map((file, index) => (
                    <div 
                      key={index} 
                      className="p-2 border rounded-md bg-muted/20 flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <Image className="h-5 w-5 text-herb-primary shrink-0" />
                        <span className="font-medium truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 shrink-0">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeImage(index)}
                        className="shrink-0"
                        disabled={uploadingImages}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {uploadingImages && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                onClick={handleUploadImages}
                disabled={imageFiles.length === 0 || uploadingImages || !!validationErrors.images}
                className="w-full"
              >
                {uploadingImages ? (
                  <>
                    <Leaf className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Images ({imageFiles.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <Button asChild>
          <Link to={`/herbs/${herb.id}`}>
            View Herb Page
          </Link>
        </Button>
      </div>
    </div>
  );
};

// Form file input component
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  );
};

// Check icon component
const Check = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default AdminUpload;
