import { db } from '../db.js';
import { currentAgents } from './current-agents-schema.js';
import { eq } from 'drizzle-orm';

export async function safeAgentsUpdate() {
  console.log('🔄 Performing safe agents update...');

  try {
    // Get existing agents
    const existingAgents = await db.select().from(currentAgents).limit(10);
    
    if (existingAgents.length === 0) {
      console.log('No existing agents found.');
      return;
    }

    console.log(`Found ${existingAgents.length} agents to update`);

    // Update each agent with only existing fields
    for (let i = 0; i < existingAgents.length; i++) {
      const agent = existingAgents[i];
      
      // Only update fields that exist in current schema
      await db.update(currentAgents)
        .set({
          verified: true,
          rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
          propertiesCount: Math.floor(Math.random() * 25) + 5,
          dealsClosed: Math.floor(Math.random() * 15) + 2,
          languages: ['English', i % 2 === 0 ? 'Arabic' : 'Hindi'],
          // Add basic bio if missing
          bioEn: agent.bioEn || `Experienced real estate agent with ${Math.floor(Math.random() * 10) + 2} years in UAE market. Specializing in ${i % 2 === 0 ? 'luxury properties' : 'residential sales'}.`,
          bioAr: agent.bioAr || `وكيل عقاري ذو خبرة ${Math.floor(Math.random() * 10) + 2} سنوات في السوق الإماراتي. متخصص في ${i % 2 === 0 ? 'العقارات الفاخرة' : 'المبيعات السكنية'}.`,
          licenseNumber: agent.licenseNumber || `DLD-${1000 + i}${Math.floor(Math.random() * 9000) + 1000}`,
          phone: agent.phone || `+971 50 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
          whatsapp: agent.whatsapp || `+971 50 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
          email: agent.email || `agent${i + 1}@aqarcity.ae`
        })
        .where(eq(currentAgents.id, agent.id));
      
      console.log(`✅ Updated agent ${i + 1}/${existingAgents.length}`);
    }

    console.log('✅ Safe agents update completed successfully!');

  } catch (error) {
    console.error('❌ Error in safe agents update:', error);
    throw error;
  }
}

// Run the update
safeAgentsUpdate()
  .then(() => {
    console.log('Safe agents update completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Safe agents update failed:', error);
    process.exit(1);
  });