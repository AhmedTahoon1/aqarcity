import express from 'express';
import { db } from '../../db';
import { savedSearches } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get user's saved searches
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    
    const userSavedSearches = await db.select()
      .from(savedSearches)
      .where(and(
        eq(savedSearches.userId, userId),
        eq(savedSearches.isActive, true)
      ));

    res.json(userSavedSearches);
  } catch (error) {
    console.error('Saved searches fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch saved searches' });
  }
});

// Create new saved search
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { name, searchCriteria, alertsEnabled = true, alertFrequency = 'instant' } = req.body;

    const newSavedSearch = await db.insert(savedSearches).values({
      userId,
      name,
      searchCriteria,
      alertsEnabled,
      alertFrequency,
    }).returning();

    res.status(201).json({
      message: 'Search saved successfully',
      savedSearch: newSavedSearch[0]
    });
  } catch (error) {
    console.error('Save search error:', error);
    res.status(500).json({ error: 'Failed to save search' });
  }
});

// Update saved search
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const updateData = req.body;

    const updatedSearch = await db.update(savedSearches)
      .set({ ...updateData, updatedAt: new Date() })
      .where(and(
        eq(savedSearches.id, id),
        eq(savedSearches.userId, userId)
      ))
      .returning();

    if (!updatedSearch.length) {
      return res.status(404).json({ error: 'Saved search not found' });
    }

    res.json({
      message: 'Search updated successfully',
      savedSearch: updatedSearch[0]
    });
  } catch (error) {
    console.error('Update saved search error:', error);
    res.status(500).json({ error: 'Failed to update search' });
  }
});

// Delete saved search
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const deletedSearch = await db.update(savedSearches)
      .set({ isActive: false })
      .where(and(
        eq(savedSearches.id, id),
        eq(savedSearches.userId, userId)
      ))
      .returning();

    if (!deletedSearch.length) {
      return res.status(404).json({ error: 'Saved search not found' });
    }

    res.json({ message: 'Search deleted successfully' });
  } catch (error) {
    console.error('Delete saved search error:', error);
    res.status(500).json({ error: 'Failed to delete search' });
  }
});

export default router;