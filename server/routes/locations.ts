import express from 'express';
import { db } from '../../db';
import { locations } from '../../shared/schema';
import { eq, asc } from 'drizzle-orm';

const router = express.Router();

// Get all active locations
router.get('/', async (req, res) => {
  try {
    const activeLocations = await db.select()
      .from(locations)
      .where(eq(locations.isActive, true))
      .orderBy(asc(locations.displayOrder), asc(locations.nameEn));

    res.json(activeLocations);
  } catch (error) {
    console.error('Locations fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Get single location
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const location = await db.select()
      .from(locations)
      .where(eq(locations.id, id))
      .limit(1);

    if (!location.length) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json(location[0]);
  } catch (error) {
    console.error('Location fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
});

export default router;
