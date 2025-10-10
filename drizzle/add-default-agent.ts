import { db } from '../db.js';
import { users, agents, properties } from '../shared/schema.js';
import { eq, isNull } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function addDefaultAgent() {
  console.log('🔧 Adding default agent...');

  try {
    // Check if we have any agents
    const existingAgents = await db.select().from(agents).limit(1);
    
    if (existingAgents.length === 0) {
      console.log('No agents found, creating default agent...');
      
      // Create default user for agent
      const hashedPassword = await bcrypt.hash('agent123!', 12);
      const defaultUser = await db.insert(users).values({
        email: 'defaultagent@aqarcity.ae',
        name: 'Default Agent',
        phone: '+971501234567',
        password: hashedPassword,
        role: 'agent',
        languagePreference: 'en'
      }).returning();

      // Create default agent
      const defaultAgent = await db.insert(agents).values({
        userId: defaultUser[0].id,
        bioEn: 'Professional real estate agent in UAE',
        bioAr: 'وكيل عقاري محترف في دولة الإمارات',
        licenseNumber: 'RERA-DEFAULT',
        verified: true,
        rating: '4.5',
        languages: ['English', 'Arabic'],
        phone: '+971501234567',
        whatsapp: '+971501234567',
        email: 'defaultagent@aqarcity.ae'
      }).returning();

      console.log('✅ Default agent created');

      // Update properties without agents to use default agent
      const propertiesWithoutAgent = await db.select()
        .from(properties)
        .where(isNull(properties.agentId));

      if (propertiesWithoutAgent.length > 0) {
        await db.update(properties)
          .set({ agentId: defaultAgent[0].id })
          .where(isNull(properties.agentId));
        
        console.log(`✅ Updated ${propertiesWithoutAgent.length} properties with default agent`);
      }
    } else {
      console.log('✅ Agents already exist');
      
      // Still update properties without agents
      const propertiesWithoutAgent = await db.select()
        .from(properties)
        .where(isNull(properties.agentId));

      if (propertiesWithoutAgent.length > 0) {
        await db.update(properties)
          .set({ agentId: existingAgents[0].id })
          .where(isNull(properties.agentId));
        
        console.log(`✅ Updated ${propertiesWithoutAgent.length} properties with existing agent`);
      }
    }

    console.log('🎉 Default agent setup completed!');
    
  } catch (error) {
    console.error('❌ Failed to add default agent:', error);
    throw error;
  }
}

addDefaultAgent()
  .then(() => {
    console.log('✅ Default agent setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Default agent setup failed:', error);
    process.exit(1);
  });