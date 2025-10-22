import { db } from '../db.js';
import { agents } from '../shared/schema.js';
import { sql } from 'drizzle-orm';

async function checkAgentsSchema() {
  console.log('🔍 Checking current agents table schema...');

  try {
    // Get existing agents to see current structure
    const existingAgents = await db.select().from(agents).limit(1);
    
    if (existingAgents.length > 0) {
      console.log('Sample agent record structure:');
      console.log(JSON.stringify(existingAgents[0], null, 2));
    }

    // Count total agents
    const agentsCount = await db.select({ count: sql<number>`count(*)` }).from(agents);
    console.log(`\nTotal agents in database: ${agentsCount[0].count}`);

  } catch (error) {
    console.error('❌ Error checking schema:', error);
  }
}

checkAgentsSchema()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Schema check failed:', error);
    process.exit(1);
  });