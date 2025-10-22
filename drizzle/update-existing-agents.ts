import { db } from '../db.js';
import { agents } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

export async function updateExistingAgents() {
  console.log('🔄 Updating existing agents with basic enhanced data...');

  try {
    // Get existing agents
    const existingAgents = await db.select().from(agents).limit(10);
    
    if (existingAgents.length === 0) {
      console.log('No existing agents found.');
      return;
    }

    console.log(`Found ${existingAgents.length} agents to update`);

    // Update each agent with basic data that exists in current schema
    for (let i = 0; i < existingAgents.length; i++) {
      const agent = existingAgents[i];
      
      await db.update(agents)
        .set({
          verified: true,
          rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
          propertiesCount: Math.floor(Math.random() * 25) + 5,
          dealsClosed: Math.floor(Math.random() * 15) + 2,
          languages: ['English', i % 2 === 0 ? 'Arabic' : 'Hindi'],
          updatedAt: new Date()
        })
        .where(eq(agents.id, agent.id));
      
      console.log(`✅ Updated agent ${i + 1}/${existingAgents.length}`);
    }

    console.log('✅ All existing agents updated successfully!');

  } catch (error) {
    console.error('❌ Error updating existing agents:', error);
    throw error;
  }
}

// Run the update
updateExistingAgents()
  .then(() => {
    console.log('Agents update completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Agents update failed:', error);
    process.exit(1);
  });