import { db } from '../db.js';
import { properties, developers, agents } from '../shared/schema.js';

async function seedMore() {
  console.log('🌱 Adding more properties...');

  try {
    // Get existing agent and developer
    const existingAgents = await db.select().from(agents).limit(1);
    const existingDevelopers = await db.select().from(developers).limit(1);
    
    const agentId = existingAgents[0]?.id;
    const developerId = existingDevelopers[0]?.id;

    // Add more properties
    const moreProperties = [
      {
        titleEn: 'Beachfront Penthouse in JBR',
        titleAr: 'بنتهاوس على الشاطئ في جي بي آر',
        descriptionEn: 'Stunning penthouse with panoramic sea views and private terrace',
        descriptionAr: 'بنتهاوس مذهل مع إطلالة بانورامية على البحر وتراس خاص',
        location: 'Jumeirah Beach Residence, Dubai',
        city: 'Dubai',
        areaName: 'JBR',
        coordinates: { lat: 25.0769, lng: 55.1413 },
        price: '8500000',
        status: 'sale' as const,
        propertyType: 'penthouse' as const,
        bedrooms: 4,
        bathrooms: 5,
        areaSqft: 3500,
        yearBuilt: 2024,
        features: ['Sea View', 'Private Terrace', 'Beach Access', 'Concierge'],
        images: ['/images/penthouse1.jpg', '/images/penthouse2.jpg'],
        agentId,
        developerId,
        isFeatured: true
      },
      {
        titleEn: 'Modern Studio in Business Bay',
        titleAr: 'استوديو عصري في الخليج التجاري',
        descriptionEn: 'Fully furnished studio apartment with canal views',
        descriptionAr: 'شقة استوديو مفروشة بالكامل مع إطلالة على القناة',
        location: 'Business Bay, Dubai',
        city: 'Dubai',
        areaName: 'Business Bay',
        coordinates: { lat: 25.1877, lng: 55.2632 },
        price: '850000',
        status: 'sale' as const,
        propertyType: 'apartment' as const,
        bedrooms: 0,
        bathrooms: 1,
        areaSqft: 450,
        yearBuilt: 2023,
        features: ['Canal View', 'Furnished', 'Gym', 'Pool'],
        images: ['/images/studio1.jpg'],
        agentId,
        isFeatured: false
      },
      {
        titleEn: 'Family Villa in Al Barsha',
        titleAr: 'فيلا عائلية في البرشاء',
        descriptionEn: '4-bedroom villa in quiet residential community',
        descriptionAr: 'فيلا من 4 غرف نوم في مجتمع سكني هادئ',
        location: 'Al Barsha, Dubai',
        city: 'Dubai',
        areaName: 'Al Barsha',
        coordinates: { lat: 25.1167, lng: 55.2042 },
        price: '3800000',
        status: 'sale' as const,
        propertyType: 'villa' as const,
        bedrooms: 4,
        bathrooms: 5,
        areaSqft: 3200,
        yearBuilt: 2022,
        features: ['Garden', 'Maid Room', 'Study Room', 'Garage'],
        images: ['/images/villa3.jpg'],
        agentId,
        developerId,
        isFeatured: false
      },
      {
        titleEn: 'Luxury Apartment for Rent in Marina',
        titleAr: 'شقة فاخرة للإيجار في المارينا',
        descriptionEn: '2-bedroom apartment with marina views for rent',
        descriptionAr: 'شقة من غرفتي نوم مع إطلالة على المارينا للإيجار',
        location: 'Dubai Marina, Dubai',
        city: 'Dubai',
        areaName: 'Marina',
        coordinates: { lat: 25.0772, lng: 55.1392 },
        price: '120000',
        status: 'rent' as const,
        propertyType: 'apartment' as const,
        bedrooms: 2,
        bathrooms: 2,
        areaSqft: 1100,
        yearBuilt: 2021,
        features: ['Marina View', 'Balcony', 'Gym', 'Pool'],
        images: ['/images/marina1.jpg'],
        agentId,
        isFeatured: false
      },
      {
        titleEn: 'Spacious Office in DIFC',
        titleAr: 'مكتب واسع في مركز دبي المالي',
        descriptionEn: 'Premium office space in Dubai International Financial Centre',
        descriptionAr: 'مساحة مكتبية مميزة في مركز دبي المالي العالمي',
        location: 'DIFC, Dubai',
        city: 'Dubai',
        areaName: 'DIFC',
        coordinates: { lat: 25.2138, lng: 55.2824 },
        price: '2500000',
        status: 'sale' as const,
        propertyType: 'apartment' as const,
        bedrooms: 0,
        bathrooms: 2,
        areaSqft: 800,
        yearBuilt: 2023,
        features: ['City View', 'Meeting Rooms', 'Reception', 'Parking'],
        images: ['/images/office1.jpg'],
        agentId,
        isFeatured: false
      }
    ];

    await db.insert(properties).values(moreProperties);
    console.log('✅ Added 5 more properties');

    console.log('🎉 More properties seeded successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

seedMore()
  .then(() => {
    console.log('✅ Additional seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Additional seeding failed:', error);
    process.exit(1);
  });