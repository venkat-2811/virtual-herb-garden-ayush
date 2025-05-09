
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useHerbs } from '@/contexts/HerbContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Leaf, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

const AdminHerbForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getHerbById, addHerb, updateHerb, loading } = useHerbs();
  
  const isEditing = !!id;
  const existingHerb = isEditing && id ? getHerbById(id) : null;
  
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    description: '',
    regions: [''],
    uses: [''],
    compositions: ['']
  });
  
  useEffect(() => {
    if (existingHerb) {
      setFormData({
        name: existingHerb.name,
        scientificName: existingHerb.scientificName,
        description: existingHerb.description,
        regions: [...existingHerb.region],
        uses: [...existingHerb.uses],
        compositions: [...existingHerb.composition]
      });
    }
  }, [existingHerb]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleArrayChange = (
    field: 'regions' | 'uses' | 'compositions',
    index: number,
    value: string
  ) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };
  
  const addArrayItem = (field: 'regions' | 'uses' | 'compositions') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };
  
  const removeArrayItem = (field: 'regions' | 'uses' | 'compositions', index: number) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.scientificName || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Filter out empty array items
    const filteredRegions = formData.regions.filter(r => r.trim() !== '');
    const filteredUses = formData.uses.filter(u => u.trim() !== '');
    const filteredCompositions = formData.compositions.filter(c => c.trim() !== '');
    
    if (filteredRegions.length === 0 || filteredUses.length === 0 || filteredCompositions.length === 0) {
      toast.error('Please add at least one region, use, and composition');
      return;
    }
    
    try {
      if (isEditing && existingHerb) {
        updateHerb(existingHerb.id, {
          name: formData.name,
          scientificName: formData.scientificName,
          description: formData.description,
          region: filteredRegions,
          uses: filteredUses,
          composition: filteredCompositions
        });
        
        toast.success('Herb updated successfully');
        navigate(`/herbs/${existingHerb.id}`);
      } else {
        addHerb({
          name: formData.name,
          scientificName: formData.scientificName,
          description: formData.description,
          region: filteredRegions,
          uses: filteredUses,
          composition: filteredCompositions,
          images: []
        });
        
        toast.success('Herb added successfully');
        navigate('/admin/herbs');
      }
    } catch (error) {
      toast.error('Error saving herb');
      console.error('Error saving herb:', error);
    }
  };
  
  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-4 pl-0" onClick={() => navigate('/admin/herbs')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Herbs
      </Button>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif font-bold">
          {isEditing ? 'Edit Herb' : 'Add New Herb'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6 p-6 bg-white rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Herb Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Tulsi"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scientificName">Scientific Name <span className="text-red-500">*</span></Label>
              <Input
                id="scientificName"
                name="scientificName"
                value={formData.scientificName}
                onChange={handleChange}
                placeholder="e.g., Ocimum sanctum"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the herb, its appearance, and general properties..."
              rows={5}
              required
            />
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Regions</h2>
          
          {formData.regions.map((region, index) => (
            <div key={`region-${index}`} className="flex items-center space-x-2 mb-4">
              <Input
                value={region}
                onChange={(e) => handleArrayChange('regions', index, e.target.value)}
                placeholder="e.g., India"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeArrayItem('regions', index)}
                disabled={formData.regions.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('regions')}
            className="flex items-center mt-2"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Region
          </Button>
        </div>
        
        <div className="p-6 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Medicinal Uses</h2>
          
          {formData.uses.map((use, index) => (
            <div key={`use-${index}`} className="flex items-center space-x-2 mb-4">
              <Input
                value={use}
                onChange={(e) => handleArrayChange('uses', index, e.target.value)}
                placeholder="e.g., Stress relief"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeArrayItem('uses', index)}
                disabled={formData.uses.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('uses')}
            className="flex items-center mt-2"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Use
          </Button>
        </div>
        
        <div className="p-6 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Chemical Composition</h2>
          
          {formData.compositions.map((composition, index) => (
            <div key={`composition-${index}`} className="flex items-center space-x-2 mb-4">
              <Input
                value={composition}
                onChange={(e) => handleArrayChange('compositions', index, e.target.value)}
                placeholder="e.g., Eugenol"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeArrayItem('compositions', index)}
                disabled={formData.compositions.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('compositions')}
            className="flex items-center mt-2"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Composition
          </Button>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/herbs')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-herb-primary hover:bg-herb-secondary"
          >
            {loading ? (
              <>
                <Leaf className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Herb'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminHerbForm;
