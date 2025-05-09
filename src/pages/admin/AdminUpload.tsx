
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useHerbs } from '@/contexts/HerbContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Upload, X, Image, Leaf } from 'lucide-react';
import { toast } from 'sonner';

const AdminUpload: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getHerbById, uploadHerbModel, uploadHerbImages, loading } = useHerbs();
  
  const herb = id ? getHerbById(id) : null;
  
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadingModel, setUploadingModel] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  
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
  
  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setModelFile(e.target.files[0]);
    }
  };
  
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...filesArray]);
    }
  };
  
  const removeImage = (index: number) => {
    setImageFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };
  
  const handleUploadModel = async () => {
    if (!modelFile) {
      toast.error('Please select a model file');
      return;
    }
    
    if (!modelFile.name.toLowerCase().endsWith('.glb')) {
      toast.error('Please select a GLB file');
      return;
    }
    
    try {
      setUploadingModel(true);
      await uploadHerbModel(herb.id, modelFile);
      toast.success('3D model uploaded successfully');
      setModelFile(null);
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
    
    // Check if all files are images
    const areAllImages = imageFiles.every(file => 
      file.type.startsWith('image/')
    );
    
    if (!areAllImages) {
      toast.error('Please select only image files');
      return;
    }
    
    try {
      setUploadingImages(true);
      await uploadHerbImages(herb.id, imageFiles);
      toast.success('Images uploaded successfully');
      setImageFiles([]);
    } catch (error) {
      toast.error('Failed to upload images');
      console.error('Error uploading images:', error);
    } finally {
      setUploadingImages(false);
    }
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
          Upload 3D models and images for this herb.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 3D Model Upload */}
        <div className="p-6 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Upload 3D Model</h2>
          <p className="text-gray-600 mb-4">
            Upload a GLB format 3D model of the herb. This will be used in the virtual garden.
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
                />
              </div>
            </div>
            
            {modelFile && (
              <div className="p-4 border rounded-md bg-muted/20 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5 text-herb-primary" />
                  <span className="font-medium">{modelFile.name}</span>
                  <span className="text-sm text-gray-500">
                    ({(modelFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setModelFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                onClick={handleUploadModel}
                disabled={!modelFile || uploadingModel}
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
          </div>
        </div>
        
        {/* Images Upload */}
        <div className="p-6 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
          <p className="text-gray-600 mb-4">
            Upload high-quality images of the herb. These will be displayed in the herb details page.
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="images">Select Images</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="flex-1"
                />
              </div>
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
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeImage(index)}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                onClick={handleUploadImages}
                disabled={imageFiles.length === 0 || uploadingImages}
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

export default AdminUpload;
