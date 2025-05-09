
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  favoriteHerbs: string[];
}

export interface HerbImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Herb {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  uses: string[];
  region: string[];
  composition: string[];
  images: HerbImage[];
  model3dUrl?: string; // URL to the .glb file for 3D rendering
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SearchFilters {
  query: string;
  regions: string[];
  uses: string[];
  compositions: string[];
}
