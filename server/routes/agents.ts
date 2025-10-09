import express from 'express';
import { db } from '../../db.js';
import { agents, users, properties, reviews } from '../../shared/schema.js';
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

// Get single agent
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

    res.json(agentProperties);
  } catch (error) {
    console.error('Agent properties fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch agent properties' });
  }
});

// Add review for agent
router.post('/:id/review', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const newReview = await db.insert(reviews).values({
      agentId: id,
      userId: req.user!.id,
      rating,
      comment
    }).returning();

    // Update agent rating
    const avgRating = await db.select({
      avgRating: avg(reviews.rating)
    })
    .from(reviews)
    .where(eq(reviews.agentId, id));

    await db.update(agents)
      .set({ rating: avgRating[0].avgRating?.toString() || '0' })
      .where(eq(agents.id, id));

    res.status(201).json({
      message: 'Review added successfully',
      review: newReview[0]
    });
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// Get agent reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    
    const agentReviews = await db.select({
      review: reviews,
      user: users
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.agentId, id))
    .orderBy(desc(reviews.createdAt));

    res.json(agentReviews);
  } catch (error) {
    console.error('Agent reviews fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch agent reviews' });
  }
});

export default router;