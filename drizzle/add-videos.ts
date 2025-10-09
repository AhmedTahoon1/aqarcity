import { db } from '../db.js';
import { properties } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

async function addVideos() {
  console.log('🎥 Adding YouTube videos to properties...');

  try {
    const allProperties = await db.select().from(properties);
    
    // Sample YouTube videos for different property types
    const sampleVideos = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Villa
      'https://www.youtube.com/watch?v=9bZkp7q19f0', // Apartment
      'https://www.youtube.com/watch?v=ScMzIvxBSi4', // Penthouse
    ];

    for (let i = 0; i < Math.min(3, allProperties.length); i++) {
      await db.update(properties)
        .set({ videoUrl: sampleVideos[i] })
        .where(eq(properties.id, allProperties[i].id));
    }

    console.log('✅ Added YouTube videos to properties');
    
  } catch (error) {
    console.error('❌ Failed to add videos:', error);
    throw error;
  }
}

addVideos()
  .then(() => {
    console.log('✅ Video addition completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Video addition failed:', error);
    process.exit(1);
  });