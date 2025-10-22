import express from 'express';
import { db } from '../../../db';
import { propertyFeatures } from '../../../shared/schema';
import { eq, and, sql } from 'drizzle-orm';
import { authenticateToken, requireRole, AuthRequest } from '../../middleware/auth';

const router = express.Router();

// GET /api/admin/features - Get all features hierarchically
router.get('/', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const features = await db.select().from(propertyFeatures).orderBy(propertyFeatures.category, propertyFeatures.displayOrder);
    
    // Group by category
    const grouped = features.reduce((acc, feature) => {
      if (!acc[feature.category]) acc[feature.category] = [];
      acc[feature.category].push(feature);
      return acc;
    }, {} as Record<string, any[]>);

    res.json(grouped);
  } catch (error) {
    console.error('Error fetching features:', error);
    res.status(500).json({ error: 'Failed to fetch features' });
  }
});

// POST /api/admin/features - Create new feature
router.post('/', authenticateToken, requireRole(['admin', 'super_admin']), async (req: AuthRequest, res) => {
  try {
    const { nameEn, nameAr, category, parentId, level = 1, displayOrder = 0 } = req.body;

    if (!nameEn || !nameAr || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newFeature = await db.insert(propertyFeatures).values({
      nameEn,
      nameAr,
      category,
      parentId: parentId || null,
      level,
      displayOrder,
      isActive: true
    }).returning();

    res.status(201).json({
      message: 'Feature created successfully',
      feature: newFeature[0]
    });
  } catch (error) {
    console.error('Error creating feature:', error);
    res.status(500).json({ error: 'Failed to create feature' });
  }
});

// PUT /api/admin/features/:id - Update feature
router.put('/:id', authenticateToken, requireRole(['admin', 'super_admin']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { nameEn, nameAr, category, parentId, level, displayOrder, isActive } = req.body;

    const updatedFeature = await db.update(propertyFeatures)
      .set({
        nameEn,
        nameAr,
        category,
        parentId: parentId || null,
        level,
        displayOrder,
        isActive,
        updatedAt: new Date()
      })
      .where(eq(propertyFeatures.id, id))
      .returning();

    if (!updatedFeature.length) {
      return res.status(404).json({ error: 'Feature not found' });
    }

    res.json({
      message: 'Feature updated successfully',
      feature: updatedFeature[0]
    });
  } catch (error) {
    console.error('Error updating feature:', error);
    res.status(500).json({ error: 'Failed to update feature' });
  }
});

// DELETE /api/admin/features/:id - Delete feature
router.delete('/:id', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFeature = await db.delete(propertyFeatures)
      .where(eq(propertyFeatures.id, id))
      .returning();

    if (!deletedFeature.length) {
      return res.status(404).json({ error: 'Feature not found' });
    }

    res.json({ message: 'Feature deleted successfully' });
  } catch (error) {
    console.error('Error deleting feature:', error);
    res.status(500).json({ error: 'Failed to delete feature' });
  }
});

// PUT /api/admin/features/:id/toggle - Toggle feature active status
router.put('/:id/toggle', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const feature = await db.select().from(propertyFeatures).where(eq(propertyFeatures.id, id)).limit(1);
    
    if (!feature.length) {
      return res.status(404).json({ error: 'Feature not found' });
    }

    const updatedFeature = await db.update(propertyFeatures)
      .set({ 
        isActive: !feature[0].isActive,
        updatedAt: new Date()
      })
      .where(eq(propertyFeatures.id, id))
      .returning();

    res.json({
      message: 'Feature status updated successfully',
      feature: updatedFeature[0]
    });
  } catch (error) {
    console.error('Error toggling feature:', error);
    res.status(500).json({ error: 'Failed to toggle feature' });
  }
});

export default router;