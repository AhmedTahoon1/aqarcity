import express from 'express';
import { db } from '../../db';
import { propertyFeatures } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// GET /api/features - Get all active features for public use
router.get('/', async (req, res) => {
  try {
    const features = await db.select()
      .from(propertyFeatures)
      .where(eq(propertyFeatures.isActive, true))
      .orderBy(propertyFeatures.category, propertyFeatures.displayOrder);
    
    // Create ID mapping for consistent feature IDs
    const createFeatureId = (nameEn: string): string => {
      const idMap: { [key: string]: string } = {
        'Swimming Pool': 'swimming_pool',
        'Gym': 'gym',
        'Parking': 'parking',
        'Garden': 'garden',
        'Balcony': 'balcony',
        'Elevator': 'elevator',
        'Air Conditioning': 'air_conditioning',
        'Central Heating': 'central_heating',
        'Furnished': 'furnished',
        'Kitchen Appliances': 'kitchen_appliances',
        'Laundry Room': 'laundry_room',
        'Storage Room': 'storage_room',
        'Maid Room': 'maid_room',
        'Study Room': 'study_room',
        'Walk-in Closet': 'walk_in_closet',
        'Solar Panels': 'solar_panels',
        'Near Hospital': 'near_hospital',
        'Near School': 'near_school',
        'Near Mall': 'near_mall',
        'Near Metro': 'near_metro',
        'Near Beach': 'near_beach',
        'Sea View': 'sea_view',
        'City View': 'city_view',
        'Park View': 'park_view',
        'Golf View': 'golf_view',
        'Marina View': 'marina_view',
        'Near Airport': 'near_airport',
        'Near Mosque': 'near_mosque',
        'Quiet Area': 'quiet_area',
        'Central Location': 'central_location',
        'Security Guard': 'security_guard',
        'CCTV': 'cctv',
        'Gated Community': 'gated_community',
        'Access Card': 'access_card',
        'Intercom': 'intercom',
        'Fire Alarm': 'fire_alarm',
        'Smoke Detector': 'smoke_detector',
        'Emergency Exit': 'emergency_exit',
        'Safe Deposit': 'safe_deposit',
        'Security System': 'security_system'
      };
      return idMap[nameEn] || nameEn.toLowerCase().replace(/\s+/g, '_');
    };

    // Group by category and format for frontend
    const grouped = {
      amenities: features.filter(f => f.category === 'amenities').map(f => ({
        id: createFeatureId(f.nameEn),
        nameEn: f.nameEn,
        nameAr: f.nameAr
      })),
      location: features.filter(f => f.category === 'location').map(f => ({
        id: createFeatureId(f.nameEn),
        nameEn: f.nameEn,
        nameAr: f.nameAr
      })),
      security: features.filter(f => f.category === 'security').map(f => ({
        id: createFeatureId(f.nameEn),
        nameEn: f.nameEn,
        nameAr: f.nameAr
      }))
    };

    res.json(grouped);
  } catch (error) {
    console.error('Error fetching public features:', error);
    res.status(500).json({ error: 'Failed to fetch features' });
  }
});

export default router;