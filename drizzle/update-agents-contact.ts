import { db } from '../db.js';
import { agents } from '../shared/schema.js';
import { isNull, or } from 'drizzle-orm';

async function updateAgentsContact() {
  console.log('📞 Updating agents contact info...');

  try {
    // Find agents without phone or whatsapp
    const agentsWithoutContact = await db.select()
      .from(agents)
      .where(or(isNull(agents.phone), isNull(agents.whatsapp)));

    if (agentsWithoutContact.length > 0) {
      console.log(`Found ${agentsWithoutContact.length} agents without complete contact info`);
      
      // Update all agents to have default contact info
      await db.update(agents)
        .set({
          phone: '+971501234567',
          whatsapp: '+971501234567',
          email: 'agent@aqarcity.ae'
        })
        .where(or(isNull(agents.phone), isNull(agents.whatsapp)));

      console.log('✅ Updated agents with default contact info');
    } else {
      console.log('✅ All agents already have contact info');
    }

    // Show current agents
    const allAgents = await db.select().from(agents);
    console.log(`📊 Total agents: ${allAgents.length}`);
    allAgents.forEach(agent => {
      console.log(`- Agent ID: ${agent.id}, Phone: ${agent.phone}, WhatsApp: ${agent.whatsapp}`);
    });

    console.log('🎉 Agents contact update completed!');
    
  } catch (error) {
    console.error('❌ Failed to update agents contact:', error);
    throw error;
  }
}

updateAgentsContact()
  .then(() => {
    console.log('✅ Agents contact update completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Agents contact update failed:', error);
    process.exit(1);
  });