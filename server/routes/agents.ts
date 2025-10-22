import express from 'express';
import { db } from '../../db.js';
import { agents, users, properties } from '../../shared/schema.js';
import { eq, desc, avg, count } from 'drizzle-orm';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all agents
router.get('/', async (req, res) => {
  try {
    const agentsList = await db.select({
      agent: agents,
      user: users
    })
    .from(agents)
    .innerJoin(users, eq(agents.userId, users.id))
    .where(eq(agents.verified, true))
    .orderBy(desc(agents.rating));

    res.json(agentsList);
  } catch (error) {
    console.error('Agents fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Get single agent with full details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const agent = await db.select({
      agent: agents,
      user: users
    })
    .from(agents)
    .innerJoin(users, eq(agents.userId, users.id))
    .where(eq(agents.id, id))
    .limit(1);

    if (!agent.length) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json(agent[0]);
  } catch (error) {
    console.error('Agent fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

// Get agent properties
router.get('/:id/properties', async (req, res) => {
  try {
    const { id } = req.params;
    
    const agentProperties = await db.select()
      .from(properties)
      .where(eq(properties.agentId, id))
      .orderBy(desc(properties.createdAt));

    // Update agent properties count
    await db.update(agents)
      .set({ propertiesCount: agentProperties.length })
      .where(eq(agents.id, id));

    res.json(agentProperties);
  } catch (error) {
    console.error('Agent properties fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch agent properties' });
  }
});



// Verify agent by phone or email
router.get('/verify', async (req, res) => {
  try {
    const { phone, email } = req.query;
    
    let agent;
    if (phone) {
      agent = await db.select({
        agent: agents,
        user: users
      })
      .from(agents)
      .innerJoin(users, eq(agents.userId, users.id))
      .where(eq(agents.phone, phone as string))
      .limit(1);
    } else if (email) {
      agent = await db.select({
        agent: agents,
        user: users
      })
      .from(agents)
      .innerJoin(users, eq(agents.userId, users.id))
      .where(eq(users.email, email as string))
      .limit(1);
    }

    if (agent && agent.length > 0) {
      res.json({ found: true, agent: agent[0] });
    } else {
      res.json({ found: false });
    }
  } catch (error) {
    console.error('Agent verification error:', error);
    res.status(500).json({ error: 'Failed to verify agent' });
  }
});



export default router;