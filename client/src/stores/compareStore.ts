import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Property {
  id: string;
  title: string;
  price: number;
  city: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  status: string;
}

interface CompareStore {
  properties: Property[];
  addProperty: (property: Property) => void;
  removeProperty: (id: string) => void;
  clearAll: () => void;
  isInCompare: (id: string) => boolean;
  canAdd: () => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      properties: [],
      
      addProperty: (property) => {
        const { properties } = get();
        if (properties.length >= 4 || properties.some(p => p.id === property.id)) return;
        set({ properties: [...properties, property] });
      },
      
      removeProperty: (id) => {
        set({ properties: get().properties.filter(p => p.id !== id) });
      },
      
      clearAll: () => set({ properties: [] }),
      
      isInCompare: (id) => get().properties.some(p => p.id === id),
      
      canAdd: () => get().properties.length < 4,
    }),
    {
      name: 'property-compare',
    }
  )
);