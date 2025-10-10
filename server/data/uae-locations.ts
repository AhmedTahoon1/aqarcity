export interface Location {
  id: string;
  name: string;
  nameEn: string;
  type: 'emirate' | 'city';
  parent?: string;
}

export const uaeLocations: Location[] = [
  { id: 'dubai', name: 'دبي', nameEn: 'Dubai', type: 'emirate' },
  { id: 'abu-dhabi', name: 'أبوظبي', nameEn: 'Abu Dhabi', type: 'emirate' },
  { id: 'sharjah', name: 'الشارقة', nameEn: 'Sharjah', type: 'emirate' },
  { id: 'ajman', name: 'عجمان', nameEn: 'Ajman', type: 'emirate' },
  { id: 'rak', name: 'رأس الخيمة', nameEn: 'Ras Al Khaimah', type: 'emirate' },
  { id: 'fujairah', name: 'الفجيرة', nameEn: 'Fujairah', type: 'emirate' },
  { id: 'uaq', name: 'أم القيوين', nameEn: 'Umm Al Quwain', type: 'emirate' },
  { id: 'dubai-marina', name: 'دبي مارينا', nameEn: 'Dubai Marina', type: 'city', parent: 'dubai' },
  { id: 'downtown-dubai', name: 'وسط مدينة دبي', nameEn: 'Downtown Dubai', type: 'city', parent: 'dubai' },
  { id: 'business-bay', name: 'الخليج التجاري', nameEn: 'Business Bay', type: 'city', parent: 'dubai' },
  { id: 'abu-dhabi-city', name: 'مدينة أبوظبي', nameEn: 'Abu Dhabi City', type: 'city', parent: 'abu-dhabi' },
];