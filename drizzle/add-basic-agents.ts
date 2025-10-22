import { db } from '../db.js';
import { users } from '../shared/schema.js';
import { currentAgents } from './current-agents-schema.js';
import bcrypt from 'bcryptjs';

export async function addBasicAgents() {
  console.log('🔧 Adding basic agents...');

  try {
    // Create agent users first
    const agentUsers = [
      {
        email: 'ahmed.hassan@aqarcity.ae',
        name: 'Ahmed Hassan',
        phone: '+971 50 123 4567',
        role: 'agent' as const,
        languagePreference: 'ar' as const
      },
      {
        email: 'sarah.johnson@aqarcity.ae', 
        name: 'Sarah Johnson',
        phone: '+971 50 234 5678',
        role: 'agent' as const,
        languagePreference: 'en' as const
      },
      {
        email: 'mohammed.ali@aqarcity.ae',
        name: 'Mohammed Ali',
        phone: '+971 50 345 6789', 
        role: 'agent' as const,
        languagePreference: 'ar' as const
      }
    ];

    const hashedPassword = await bcrypt.hash('agent123', 10);

    // Insert users
    const createdUsers = await db.insert(users).values(
      agentUsers.map(user => ({
        ...user,
        password: hashedPassword
      }))
    ).returning();

    console.log(`✅ Created ${createdUsers.length} agent users`);

    // Create agent profiles
    const agentProfiles = createdUsers.map((user, index) => ({
      userId: user.id,
      bioEn: `Experienced real estate agent with ${5 + index * 2} years in UAE market. Specializing in ${index === 0 ? 'luxury properties' : index === 1 ? 'residential sales' : 'commercial properties'}.`,
      bioAr: `وكيل عقاري ذو خبرة ${5 + index * 2} سنوات في السوق الإماراتي. متخصص في ${index === 0 ? 'العقارات الفاخرة' : index === 1 ? 'المبيعات السكنية' : 'العقارات التجارية'}.`,
      licenseNumber: `DLD-${1000 + index}${Math.floor(Math.random() * 9000) + 1000}`,
      verified: true,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5-5.0
      languages: index === 1 ? ['English'] : ['Arabic', 'English'],
      propertiesCount: Math.floor(Math.random() * 20) + 10,
      dealsClosed: Math.floor(Math.random() * 10) + 5,
      phone: user.phone,
      whatsapp: user.phone,
      email: user.email
    }));

    const createdAgents = await db.insert(currentAgents).values(agentProfiles).returning();

    console.log(`✅ Created ${createdAgents.length} agent profiles`);
    console.log('✅ Basic agents setup completed successfully!');

    return createdAgents;

  } catch (error) {
    console.error('❌ Error adding basic agents:', error);
    throw error;
  }
}

// Run the setup
addBasicAgents()
  .then(() => {
    console.log('Basic agents setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Basic agents setup failed:', error);
    process.exit(1);
  });