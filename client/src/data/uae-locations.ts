export interface Location {
  id: string;
  name: string;
  nameEn: string;
  type: 'emirate' | 'city';
  parent?: string;
}

export const uaeLocations: Location[] = [
  // الإمارات الرئيسية
  { id: 'dubai', name: 'دبي', nameEn: 'Dubai', type: 'emirate' },
  { id: 'abu-dhabi', name: 'أبوظبي', nameEn: 'Abu Dhabi', type: 'emirate' },
  { id: 'sharjah', name: 'الشارقة', nameEn: 'Sharjah', type: 'emirate' },
  { id: 'ajman', name: 'عجمان', nameEn: 'Ajman', type: 'emirate' },
  { id: 'rak', name: 'رأس الخيمة', nameEn: 'Ras Al Khaimah', type: 'emirate' },
  { id: 'fujairah', name: 'الفجيرة', nameEn: 'Fujairah', type: 'emirate' },
  { id: 'uaq', name: 'أم القيوين', nameEn: 'Umm Al Quwain', type: 'emirate' },

  // مدن دبي
  { id: 'dubai-marina', name: 'دبي مارينا', nameEn: 'Dubai Marina', type: 'city', parent: 'dubai' },
  { id: 'downtown-dubai', name: 'وسط مدينة دبي', nameEn: 'Downtown Dubai', type: 'city', parent: 'dubai' },
  { id: 'jbr', name: 'شاطئ جميرا', nameEn: 'Jumeirah Beach Residence', type: 'city', parent: 'dubai' },
  { id: 'palm-jumeirah', name: 'نخلة جميرا', nameEn: 'Palm Jumeirah', type: 'city', parent: 'dubai' },
  { id: 'business-bay', name: 'الخليج التجاري', nameEn: 'Business Bay', type: 'city', parent: 'dubai' },
  { id: 'jumeirah', name: 'جميرا', nameEn: 'Jumeirah', type: 'city', parent: 'dubai' },
  { id: 'deira', name: 'ديرة', nameEn: 'Deira', type: 'city', parent: 'dubai' },
  { id: 'bur-dubai', name: 'بر دبي', nameEn: 'Bur Dubai', type: 'city', parent: 'dubai' },

  // مدن أبوظبي
  { id: 'abu-dhabi-city', name: 'مدينة أبوظبي', nameEn: 'Abu Dhabi City', type: 'city', parent: 'abu-dhabi' },
  { id: 'al-ain', name: 'العين', nameEn: 'Al Ain', type: 'city', parent: 'abu-dhabi' },
  { id: 'yas-island', name: 'جزيرة ياس', nameEn: 'Yas Island', type: 'city', parent: 'abu-dhabi' },
  { id: 'saadiyat-island', name: 'جزيرة السعديات', nameEn: 'Saadiyat Island', type: 'city', parent: 'abu-dhabi' },

  // مدن الشارقة
  { id: 'sharjah-city', name: 'مدينة الشارقة', nameEn: 'Sharjah City', type: 'city', parent: 'sharjah' },
  { id: 'al-majaz', name: 'الماجز', nameEn: 'Al Majaz', type: 'city', parent: 'sharjah' },
  { id: 'al-nahda', name: 'النهدة', nameEn: 'Al Nahda', type: 'city', parent: 'sharjah' },

  // مدن عجمان
  { id: 'ajman-city', name: 'مدينة عجمان', nameEn: 'Ajman City', type: 'city', parent: 'ajman' },

  // مدن رأس الخيمة
  { id: 'rak-city', name: 'مدينة رأس الخيمة', nameEn: 'Ras Al Khaimah City', type: 'city', parent: 'rak' },

  // مدن الفجيرة
  { id: 'fujairah-city', name: 'مدينة الفجيرة', nameEn: 'Fujairah City', type: 'city', parent: 'fujairah' },

  // مدن أم القيوين
  { id: 'uaq-city', name: 'مدينة أم القيوين', nameEn: 'Umm Al Quwain City', type: 'city', parent: 'uaq' },
];

export const getEmiratesWithCities = () => {
  const emirates = uaeLocations.filter(location => location.type === 'emirate');
  return emirates.map(emirate => ({
    ...emirate,
    cities: uaeLocations.filter(city => city.parent === emirate.id)
  }));
};

export const getLocationById = (id: string) => {
  return uaeLocations.find(location => location.id === id);
};