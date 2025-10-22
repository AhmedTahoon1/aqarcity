import { Router } from 'express';
import { db } from '../../db';
import { statistics } from '../../shared/schema';
import { eq, asc } from 'drizzle-orm';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// GET - Fetch visible statistics (public)
router.get('/', async (req, res) => {
  try {
    const stats = await db
      .select()
      .from(statistics)
      .where(eq(statistics.isVisible, true))
      .orderBy(asc(statistics.displayOrder));
    res.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// GET - Fetch all statistics (admin)
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await db.select().from(statistics).orderBy(asc(statistics.displayOrder));
    res.json(stats);
  } catch (error) {
    console.error('Error fetching all statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// POST - Create statistic (admin)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { number, titleEn, titleAr, icon, isVisible, displayOrder } = req.body;

    const newStat = await db
      .insert(statistics)
      .values({
        number,
        titleEn,
        titleAr,
        icon,
        isVisible: isVisible ?? true,
        displayOrder: displayOrder ?? 0,
      })
      .returning();

    res.json(newStat[0]);
  } catch (error) {
    console.error('Error creating statistic:', error);
    res.status(500).json({ error: 'Failed to create statistic' });
  }
});

// PUT - Update statistic (admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { number, titleEn, titleAr, icon, isVisible, displayOrder } = req.body;

    const updated = await db
      .update(statistics)
      .set({
        number,
        titleEn,
        titleAr,
        icon,
        isVisible,
        displayOrder,
        updatedAt: new Date(),
      })
      .where(eq(statistics.id, id))
      .returning();

    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating statistic:', error);
    res.status(500).json({ error: 'Failed to update statistic' });
  }
});

// DELETE - Delete statistic (admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(statistics).where(eq(statistics.id, id));
    res.json({ message: 'Statistic deleted successfully' });
  } catch (error) {
    console.error('Error deleting statistic:', error);
    res.status(500).json({ error: 'Failed to delete statistic' });
  }
});

export default router;
