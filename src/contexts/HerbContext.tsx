
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Herb, SearchFilters } from '@/types';
import { toast } from 'sonner';

interface HerbContextType {
  herbs: Herb[];
  loading: boolean;
  error: string | null;
  searchFilters: SearchFilters;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  filteredHerbs: Herb[];
  getHerbById: (id: string) => Herb | undefined;
  addHerb: (herb: Omit<Herb, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateHerb: (id: string, herbData: Partial<Herb>) => void;
  deleteHerb: (id: string) => void;
  uploadHerbModel: (id: string, modelFile: File) => Promise<void>;
  uploadHerbImages: (id: string, imageFiles: File[]) => Promise<void>;
}

const HerbContext = createContext<HerbContextType | undefined>(undefined);

// Mock data for herbs
const MOCK_HERBS: Herb[] = [
  {
    id: '1',
    name: 'Tulsi',
    scientificName: 'Ocimum sanctum',
    description: 'Tulsi, also known as Holy Basil, is a sacred plant in Hindu belief. It is known for its healing properties and is used to treat various common ailments.',
    uses: ['Respiratory disorders', 'Stress', 'Fever', 'Common cold'],
    region: ['India', 'Southeast Asia'],
    composition: ['Eugenol', 'Carvacrol', 'Linalool'],
    images: [
      {
        id: '101',
        url: 'https://cdn.pixabay.com/photo/2015/05/04/10/16/tulsi-752252_1280.jpg',
        alt: 'Tulsi plant with green leaves',
        isPrimary: true
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Ashwagandha',
    scientificName: 'Withania somnifera',
    description: 'Ashwagandha is one of the most important herbs in Ayurveda. It is known for its adaptogenic properties, helping the body manage stress.',
    uses: ['Stress relief', 'Energy boost', 'Immune support', 'Anti-inflammatory'],
    region: ['India', 'Middle East', 'Africa'],
    composition: ['Withanolides', 'Alkaloids', 'Saponins'],
    images: [
      {
        id: '102',
        url: 'https://cdn.pixabay.com/photo/2019/02/23/14/38/ashwagandha-4016508_1280.jpg',
        alt: 'Ashwagandha plant with berries',
        isPrimary: true
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Brahmi',
    scientificName: 'Bacopa monnieri',
    description: 'Brahmi is a staple plant in traditional Ayurvedic medicine. It is primarily known for its ability to improve memory and reduce anxiety and stress.',
    uses: ['Memory enhancement', 'Anxiety', 'ADHD', 'Brain function'],
    region: ['India', 'Australia', 'Europe', 'Africa', 'Asia'],
    composition: ['Bacoside A', 'Bacoside B', 'Bacopasaponins'],
    images: [
      {
        id: '103',
        url: 'https://cdn.pixabay.com/photo/2018/05/17/18/55/brahmi-3409399_1280.jpg',
        alt: 'Brahmi plant with small round leaves',
        isPrimary: true
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Neem',
    scientificName: 'Azadirachta indica',
    description: 'Neem, a tree in the mahogany family, is known for its pesticidal and medicinal properties. It has been used in traditional medicine for thousands of years.',
    uses: ['Skin disorders', 'Dental care', 'Anti-inflammatory', 'Detoxification'],
    region: ['India', 'Southeast Asia', 'Africa'],
    composition: ['Nimbin', 'Azadirachtin', 'Nimbidin'],
    images: [
      {
        id: '104',
        url: 'https://cdn.pixabay.com/photo/2015/04/10/17/09/neem-716735_1280.jpg',
        alt: 'Neem tree with characteristic leaves',
        isPrimary: true
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    description: 'Aloe vera is a succulent plant species known for the medicinal properties of its gel. It has been used for centuries for its health, beauty, and skin care properties.',
    uses: ['Skin care', 'Wound healing', 'Digestive health', 'Immune support'],
    region: ['Africa', 'Mediterranean', 'India'],
    composition: ['Aloin', 'Glucomannans', 'Anthraquinones'],
    images: [
      {
        id: '105',
        url: 'https://cdn.pixabay.com/photo/2017/08/02/12/29/aloe-2571549_1280.jpg',
        alt: 'Aloe vera plant with thick leaves',
        isPrimary: true
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const HerbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [herbs, setHerbs] = useState<Herb[]>(MOCK_HERBS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    regions: [],
    uses: [],
    compositions: []
  });

  // Load herbs on component mount
  useEffect(() => {
    // Simulate API call to load herbs
    const loadHerbs = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setHerbs(MOCK_HERBS);
        setError(null);
      } catch (err) {
        setError('Failed to load herbs');
        toast.error('Failed to load herbs');
      } finally {
        setLoading(false);
      }
    };
    
    loadHerbs();
  }, []);

  const filteredHerbs = herbs.filter(herb => {
    // Filter by search query
    if (searchFilters.query && !herb.name.toLowerCase().includes(searchFilters.query.toLowerCase()) && 
        !herb.scientificName.toLowerCase().includes(searchFilters.query.toLowerCase())) {
      return false;
    }
    
    // Filter by regions
    if (searchFilters.regions.length > 0 && 
        !herb.region.some(r => searchFilters.regions.includes(r))) {
      return false;
    }
    
    // Filter by uses
    if (searchFilters.uses.length > 0 && 
        !herb.uses.some(u => searchFilters.uses.some(filter => u.toLowerCase().includes(filter.toLowerCase())))) {
      return false;
    }
    
    // Filter by compositions
    if (searchFilters.compositions.length > 0 && 
        !herb.composition.some(c => searchFilters.compositions.includes(c))) {
      return false;
    }
    
    return true;
  });

  const getHerbById = (id: string) => {
    return herbs.find(herb => herb.id === id);
  };

  const addHerb = (herbData: Omit<Herb, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newHerb: Herb = {
      ...herbData,
      id: `${herbs.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setHerbs([...herbs, newHerb]);
    toast.success('Herb added successfully');
  };

  const updateHerb = (id: string, herbData: Partial<Herb>) => {
    setHerbs(prevHerbs => 
      prevHerbs.map(herb => 
        herb.id === id 
          ? { 
              ...herb, 
              ...herbData, 
              updatedAt: new Date().toISOString() 
            } 
          : herb
      )
    );
    toast.success('Herb updated successfully');
  };

  const deleteHerb = (id: string) => {
    setHerbs(prevHerbs => prevHerbs.filter(herb => herb.id !== id));
    toast.success('Herb deleted successfully');
  };

  const uploadHerbModel = async (id: string, modelFile: File) => {
    // Simulate model upload
    setLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would upload the file to a server
      // For now, we'll just create a fake URL
      const modelUrl = URL.createObjectURL(modelFile);
      
      // Update the herb with the new model URL
      updateHerb(id, { model3dUrl: modelUrl });
      toast.success('3D model uploaded successfully');
    } catch (err) {
      setError('Failed to upload 3D model');
      toast.error('Failed to upload 3D model');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadHerbImages = async (id: string, imageFiles: File[]) => {
    // Simulate image upload
    setLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would upload the files to a server
      // For now, we'll just create fake URLs
      const newImages = imageFiles.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        alt: file.name,
        isPrimary: index === 0
      }));
      
      // Update the herb with the new images
      const herb = getHerbById(id);
      if (herb) {
        const updatedImages = [...herb.images, ...newImages];
        updateHerb(id, { images: updatedImages });
      }
      
      toast.success('Images uploaded successfully');
    } catch (err) {
      setError('Failed to upload images');
      toast.error('Failed to upload images');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    herbs,
    loading,
    error,
    searchFilters,
    setSearchFilters,
    filteredHerbs,
    getHerbById,
    addHerb,
    updateHerb,
    deleteHerb,
    uploadHerbModel,
    uploadHerbImages
  };

  return <HerbContext.Provider value={value}>{children}</HerbContext.Provider>;
};

export const useHerbs = () => {
  const context = useContext(HerbContext);
  if (context === undefined) {
    throw new Error('useHerbs must be used within a HerbProvider');
  }
  return context;
};
