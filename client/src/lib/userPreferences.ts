export interface UserPreferences {
  location: string[];
  priceRange: { min: number; max: number };
  propertyTypes: string[];
  bedrooms: number[];
  status: string[];
}

export const defaultPreferences: UserPreferences = {
  location: ['Dubai'],
  priceRange: { min: 1000000, max: 5000000 },
  propertyTypes: ['apartment', 'villa'],
  bedrooms: [2, 3, 4],
  status: ['sale']
};

export const getUserPreferences = (): UserPreferences => {
  const stored = localStorage.getItem('userPreferences');
  return stored ? JSON.parse(stored) : defaultPreferences;
};

export const saveUserPreferences = (preferences: UserPreferences) => {
  localStorage.setItem('userPreferences', JSON.stringify(preferences));
};

export const applyPreferencesToProperties = (properties: any[], preferences: UserPreferences) => {
  return properties
    .filter(item => {
      const property = item.property || item;
      const price = parseFloat(property.price);
      
      return (
        preferences.location.includes(property.city) &&
        price >= preferences.priceRange.min &&
        price <= preferences.priceRange.max &&
        preferences.propertyTypes.includes(property.propertyType) &&
        preferences.status.includes(property.status) &&
        (preferences.bedrooms.includes(property.bedrooms) || property.bedrooms === 0)
      );
    })
    .sort((a, b) => {
      const propA = a.property || a;
      const propB = b.property || b;
      
      // Prioritize featured properties
      if (propA.isFeatured && !propB.isFeatured) return -1;
      if (!propA.isFeatured && propB.isFeatured) return 1;
      
      // Then sort by price (ascending)
      return parseFloat(propA.price) - parseFloat(propB.price);
    });
};