import express from 'express';
import { db } from '../../../db.js';
import { agents, users, properties, reviews } from '../../../shared/schema.js';
import { eq, and } from 'drizzle-orm';
import { authenticateToken, AuthRequest } from '../../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get all agents for admin
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    console.log('🔍 Admin agents request from user:', req.user);
    
    const agentsList = await db.select({
      agent: agents,
      user: users
    })
    .from(agents)
    .innerJoin(users, eq(agents.userId, users.id));

    // Get reviews for each agent
    const agentsWithReviews = await Promise.all(
      agentsList.map(async (agentData) => {
        const agentReviews = await db.select()
          .from(reviews)
          .where(eq(reviews.agentId, agentData.agent.id));
        return { ...agentData, reviews: agentReviews };
      })
    );

    return res.json(agentsWithReviews);
  } catch (error) {
    console.error('Admin agents fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Create new agent
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, email, phone, whatsapp, companyName, bioEn, bioAr, profileImage, languages, officeAddress, reviews } = req.body;
    
    if (!name || !email || !phone || !whatsapp) {
      return res.status(400).json({ error: 'Name, email, phone, and whatsapp are required' });
    }
    
    const hashedPassword = await bcrypt.hash('agent123', 10);
    
    const newUser = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role: 'agent',
      phone
    }).returning();

    const newAgent = await db.insert(agents).values({
      userId: newUser[0].id,
      phone,
      whatsapp,
      companyName: companyName || null,
      bioEn: bioEn || null,
      bioAr: bioAr || null,
      profileImage: profileImage || null,
      languages: languages || ['English'],
      officeAddress: officeAddress || null,
      verified: true
    }).returning();

    if (reviews && reviews.length > 0) {
      const reviewsData = reviews.map((review: any) => ({
        agentId: newAgent[0].id,
        userId: newUser[0].id,
        rating: review.rating,
        comment: review.comment
      }));
      await db.insert(reviews).values(reviewsData);
    }

    res.status(201).json({ message: 'Agent created successfully' });
  } catch (error) {
    console.error('Agent creation error:', error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
});

// Update agent
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, whatsapp, companyName, bioEn, bioAr, profileImage, languages, officeAddress, reviews } = req.body;

    const agent = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
    if (!agent.length) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    await db.update(users)
      .set({ name, email, phone })
      .where(eq(users.id, agent[0].userId));

    await db.update(agents)
      .set({ 
        phone, 
        whatsapp, 
        companyName, 
        bioEn, 
        bioAr, 
        profileImage,
        languages: languages || ['English'],
        officeAddress: officeAddress || null
      })
      .where(eq(agents.id, id));

    if (reviews) {
      await db.delete(reviews).where(eq(reviews.agentId, id));
      if (reviews.length > 0) {
        const reviewsData = reviews.map((review: any) => ({
          agentId: id,
          userId: agent[0].userId,
          rating: review.rating,
          comment: review.comment
        }));
        await db.insert(reviews).values(reviewsData);
      }
    }

    res.json({ message: 'Agent updated successfully' });
  } catch (error) {
    console.error('Agent update error:', error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

// Delete agent
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { propertyAction } = req.body;

    const agent = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
    if (!agent.length) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    if (propertyAction === 'delete') {
      await db.delete(properties).where(eq(properties.agentId, id));
    } else if (propertyAction === 'transfer') {
      // Find default agent or create one
      const defaultAgent = await db.select().from(agents).limit(1);
      if (defaultAgent.length > 0) {
        await db.update(properties)
          .set({ agentId: defaultAgent[0].id })
          .where(eq(properties.agentId, id));
      }
    }

    await db.delete(agents).where(eq(agents.id, id));
    await db.delete(users).where(eq(users.id, agent[0].userId));

    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Agent deletion error:', error);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
});

// Toggle agent visibility
router.put('/:id/visibility', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { visible } = req.body;

    await db.update(agents)
      .set({ verified: visible })
      .where(eq(agents.id, id));

    res.json({ message: 'Agent visibility updated' });
  } catch (error) {
    console.error('Agent visibility update error:', error);
    res.status(500).json({ error: 'Failed to update visibility' });
  }
});

export default router;