export const PROPERTY_FEATURES = {
  amenities: [
    { id: 'swimming_pool', nameEn: 'Swimming Pool', nameAr: 'مسبح' },
    { id: 'gym', nameEn: 'Gym', nameAr: 'صالة رياضية' },
    { id: 'parking', nameEn: 'Parking', nameAr: 'موقف سيارات' },
    { id: 'garden', nameEn: 'Garden', nameAr: 'حديقة' },
    { id: 'balcony', nameEn: 'Balcony', nameAr: 'شرفة' },
    { id: 'elevator', nameEn: 'Elevator', nameAr: 'مصعد' },
    { id: 'air_conditioning', nameEn: 'Air Conditioning', nameAr: 'تكييف' },
    { id: 'central_heating', nameEn: 'Central Heating', nameAr: 'تدفئة مركزية' },
    { id: 'furnished', nameEn: 'Furnished', nameAr: 'مفروش' },
    { id: 'kitchen_appliances', nameEn: 'Kitchen Appliances', nameAr: 'أجهزة مطبخ' },
    { id: 'laundry_room', nameEn: 'Laundry Room', nameAr: 'غرفة غسيل' },
    { id: 'storage_room', nameEn: 'Storage Room', nameAr: 'غرفة تخزين' },
    { id: 'maid_room', nameEn: 'Maid Room', nameAr: 'غرفة خادمة' },
    { id: 'study_room', nameEn: 'Study Room', nameAr: 'غرفة دراسة' },
    { id: 'walk_in_closet', nameEn: 'Walk-in Closet', nameAr: 'خزانة ملابس' }
  ],
  location: [
    { id: 'near_hospital', nameEn: 'Near Hospital', nameAr: 'قريب من مستشفى' },
    { id: 'near_school', nameEn: 'Near School', nameAr: 'قريب من مدرسة' },
    { id: 'near_mall', nameEn: 'Near Mall', nameAr: 'قريب من مول' },
    { id: 'near_metro', nameEn: 'Near Metro', nameAr: 'قريب من المترو' },
    { id: 'near_beach', nameEn: 'Near Beach', nameAr: 'قريب من الشاطئ' },
    { id: 'sea_view', nameEn: 'Sea View', nameAr: 'مطل على البحر' },
    { id: 'city_view', nameEn: 'City View', nameAr: 'مطل على المدينة' },
    { id: 'park_view', nameEn: 'Park View', nameAr: 'مطل على الحديقة' },
    { id: 'golf_view', nameEn: 'Golf View', nameAr: 'مطل على الجولف' },
    { id: 'marina_view', nameEn: 'Marina View', nameAr: 'مطل على المارينا' },
    { id: 'near_airport', nameEn: 'Near Airport', nameAr: 'قريب من المطار' },
    { id: 'near_mosque', nameEn: 'Near Mosque', nameAr: 'قريب من مسجد' },
    { id: 'quiet_area', nameEn: 'Quiet Area', nameAr: 'منطقة هادئة' },
    { id: 'central_location', nameEn: 'Central Location', nameAr: 'موقع مركزي' }
  ],
  security: [
    { id: 'security_guard', nameEn: 'Security Guard', nameAr: 'حارس أمن' },
    { id: 'cctv', nameEn: 'CCTV', nameAr: 'كاميرات مراقبة' },
    { id: 'gated_community', nameEn: 'Gated Community', nameAr: 'مجتمع مسور' },
    { id: 'access_card', nameEn: 'Access Card', nameAr: 'بطاقة دخول' },
    { id: 'intercom', nameEn: 'Intercom', nameAr: 'اتصال داخلي' },
    { id: 'fire_alarm', nameEn: 'Fire Alarm', nameAr: 'إنذار حريق' },
    { id: 'smoke_detector', nameEn: 'Smoke Detector', nameAr: 'كاشف دخان' },
    { id: 'emergency_exit', nameEn: 'Emergency Exit', nameAr: 'مخرج طوارئ' },
    { id: 'safe_deposit', nameEn: 'Safe Deposit', nameAr: 'خزنة آمنة' },
    { id: 'security_system', nameEn: 'Security System', nameAr: 'نظام أمني' }
  ]
};

export type FeatureCategory = keyof typeof PROPERTY_FEATURES;
export type PropertyFeature = typeof PROPERTY_FEATURES[FeatureCategory][number];

export const getFeaturesByCategory = (category: FeatureCategory) => PROPERTY_FEATURES[category];

export const getFeatureById = (id: string): PropertyFeature | undefined => {
  for (const category of Object.values(PROPERTY_FEATURES)) {
    const feature = category.find(f => f.id === id);
    if (feature) return feature;
  }
  return undefined;
};

export const getFeatureName = (id: string, language: 'en' | 'ar'): string => {
  const feature = getFeatureById(id);
  return feature ? (language === 'ar' ? feature.nameAr : feature.nameEn) : id;
};