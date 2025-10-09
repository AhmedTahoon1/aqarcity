import express from 'express';
import { db } from '../../db.js';
import { favorites, properties, agents } from '../../shared/schema.js';
import { eq, and } from 'drizzle-orm';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get user favorites
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userFavorites = await db.select({
      favorite: favorites,
      property: properties,
      agent: agents
    })
    .from(favorites)
    .innerJoin(properties, eq(favorites.propertyId, properties.id))
    .leftJoin(agents, eq(properties.agentId, agents.id))
    .where(eq(favorites.userId, req.user!.id));

    res.json(userFavorites);
  } catch (error) {
    console.error('Favorites fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add to favorites
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { propertyId } = req.body;

    // Check if already in favorites
    const existing = await db.select()
      .from(favorites)
      .where(and(
        eq(favorites.userId, req.user!.id),
        eq(favorites.propertyId, propertyId)
      ))
      .limit(1);

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Property already in favorites' });
    }

    const newFavorite = await db.insert(favorites).values({
      userId: req.user!.id,
      propertyId
    }).returning();

    res.status(201).json({
      message: 'Added to favorites',
      favorite: newFavorite[0]
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

// Remove from favorites
router.delete('/:propertyId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { propertyId } = req.params;

    const deleted = await db.delete(favorites)
      .where(and(
        eq(favorites.propertyId, propertyId),
        eq(favorites.userId, req.user!.id)
      ))
      .returning();

    if (!deleted.length) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

// Check if property is in favorites
router.get('/check/:propertyId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { propertyId } = req.params;

    const favorite = await db.select()
      .from(favorites)
      .where(and(
        eq(favorites.userId, req.user!.id),
        eq(favorites.propertyId, propertyId)
      ))
      .limit(1);

    res.json({ isFavorite: favorite.length > 0 });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ error: 'Failed to check favorite status' });
  }
});

export default router;