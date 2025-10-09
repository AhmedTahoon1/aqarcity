import express from 'express';
import { db } from '../../db';
import { developers, properties } from '../../shared/schema';
import { eq, desc } from 'drizzle-orm';

const router = express.Router();

// Get all developers
router.get('/', async (req, res) => {
  try {
    const allDevelopers = await db.select().from(developers).orderBy(desc(developers.projectsCount));
    res.json(allDevelopers);
  } catch (error) {
    console.error('Developers fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch developers' });
  }
});

// Get single developer
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const developer = await db.select().from(developers).where(eq(developers.id, id)).limit(1);
    
    if (!developer.length) {
      return res.status(404).json({ error: 'Developer not found' });
    }

    res.json(developer[0]);
  } catch (error) {
    console.error('Developer fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch developer' });
  }
});

// Get developer properties
router.get('/:id/properties', async (req, res) => {
  try {
    const { id } = req.params;
    
    const developerProperties = await db.select().from(properties)
      .where(eq(properties.developerId, id))
      .orderBy(desc(properties.createdAt));

    res.json(developerProperties);
  } catch (error) {
    console.error('Developer properties fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch developer properties' });
  }
});

export default router;