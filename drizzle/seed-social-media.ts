import { db } from '../db.js';
import { socialMediaLinks } from '../shared/schema.js';

async function seedSocialMedia() {
  try {
    console.log('🔄 Seeding social media links...');

    // Check if record exists
    const existing = await db.select().from(socialMediaLinks).limit(1);

    if (existing.length === 0) {
      await db.insert(socialMediaLinks).values({
        facebook: null,
        instagram: null,
        x: null,
        snapchat: null,
        linkedin: null,
        tiktok: null,
        youtube: null,
      });
      console.log('✅ Social media links table initialized');
    } else {
      console.log('✅ Social media links already exist');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding social media:', error);
    process.exit(1);
  }
}

seedSocialMedia();
