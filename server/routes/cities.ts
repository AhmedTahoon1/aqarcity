import express from 'express';
import { db } from '../../db';
import { emirates, addresses } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';

const router = express.Router();

// GET /api/cities - Get all emirates with their areas
router.get('/', async (req, res) => {
  try {
    // Get all emirates
    const emiratesList = await db
      .select()
      .from(emirates)
      .where(eq(emirates.isActive, true))
      .orderBy(emirates.displayOrder);

    // Get all areas for each emirate
    const result = [];
    for (const emirate of emiratesList) {
      const emirateAreas = await db
        .select()
        .from(addresses)
        .where(and(eq(addresses.parentId, emirate.id), eq(addresses.isActive, true)))
        .orderBy(addresses.displayOrder);

      result.push({
        ...emirate,
        areas: emirateAreas
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// GET /api/cities/emirates - Get emirates only
router.get('/emirates', async (req, res) => {
  try {
    const emiratesList = await db
      .select()
      .from(emirates)
      .where(eq(emirates.isActive, true))
      .orderBy(emirates.displayOrder);

    res.json(emiratesList);
  } catch (error) {
    console.error('Error fetching emirates:', error);
    res.status(500).json({ error: 'Failed to fetch emirates' });
  }
});

// GET /api/cities/:emirateId/areas - Get areas for an emirate
router.get('/:emirateId/areas', async (req, res) => {
  try {
    const { emirateId } = req.params;
    
    const emirateAreas = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.parentId, emirateId), eq(addresses.isActive, true)))
      .orderBy(addresses.displayOrder);

    res.json(emirateAreas);
  } catch (error) {
    console.error('Error fetching areas:', error);
    res.status(500).json({ error: 'Failed to fetch areas' });
  }
});

export default router;