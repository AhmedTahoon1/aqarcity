import { db } from './db';
import { agents, users } from './shared/schema';
import { eq } from 'drizzle-orm';

async function checkAgentsTable() {
  try {
    console.log('🔍 Checking agents table...');
    
    // Check if agents table exists and has data
    const agentsList = await db.select().from(agents).limit(5);
    console.log('✅ Agents table exists');
    console.log(`📊 Found ${agentsList.length} agents`);
    
    if (agentsList.length > 0) {
      console.log('📋 Sample agent:', agentsList[0]);
    }
    
    // Check users table for agents
    const agentUsers = await db.select()
      .from(users)
      .where(eq(users.role, 'agent'))
      .limit(5);
    
    console.log(`👥 Found ${agentUsers.length} users with agent role`);
    
  } catch (error) {
    console.error('❌ Error checking agents table:', error);
    console.log('💡 You may need to run migrations or seed data');
  }
}

checkAgentsTable();