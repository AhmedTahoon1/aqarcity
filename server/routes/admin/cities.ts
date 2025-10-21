import express from 'express';
import { db } from '../../../db';
import { emirates, addresses } from '../../../shared/schema';
import { eq } from 'drizzle-orm';
import { authenticateToken, requireRole } from '../../middleware/auth';

const router = express.Router();

// POST /api/admin/cities/emirates - Create new emirate
router.post('/emirates', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { nameEn, nameAr, displayOrder } = req.body;

    if (!nameEn || !nameAr) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [newEmirate] = await db.insert(emirates).values({
      nameEn,
      nameAr,
      displayOrder: displayOrder || 0,
      isActive: true
    }).returning();

    res.status(201).json(newEmirate);
  } catch (error) {
    console.error('Error creating emirate:', error);
    res.status(500).json({ error: 'Failed to create emirate' });
  }
});

// POST /api/admin/cities/areas - Create new area
router.post('/areas', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { nameEn, nameAr, emirateId, displayOrder } = req.body;

    if (!nameEn || !nameAr || !emirateId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate emirate exists
    const emirate = await db.select().from(emirates).where(eq(emirates.id, emirateId)).limit(1);
    if (emirate.length === 0) {
      return res.status(400).json({ error: 'Emirate not found' });
    }

    const [newArea] = await db.insert(addresses).values({
      nameEn,
      nameAr,
      parentId: emirateId,
      level: 1,
      displayOrder: displayOrder || 0,
      isActive: true
    }).returning();

    res.status(201).json(newArea);
  } catch (error) {
    console.error('Error creating area:', error);
    res.status(500).json({ error: 'Failed to create area' });
  }
});

// PUT /api/admin/cities/emirates/:id - Update emirate
router.put('/emirates/:id', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { nameEn, nameAr, displayOrder, isActive } = req.body;

    const [updatedEmirate] = await db
      .update(emirates)
      .set({
        nameEn,
        nameAr,
        displayOrder,
        isActive,
        updatedAt: new Date()
      })
      .where(eq(emirates.id, id))
      .returning();

    if (!updatedEmirate) {
      return res.status(404).json({ error: 'Emirate not found' });
    }

    res.json(updatedEmirate);
  } catch (error) {
    console.error('Error updating emirate:', error);
    res.status(500).json({ error: 'Failed to update emirate' });
  }
});

// PUT /api/admin/cities/areas/:id - Update area
router.put('/areas/:id', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { nameEn, nameAr, emirateId, displayOrder, isActive } = req.body;

    const [updatedArea] = await db
      .update(addresses)
      .set({
        nameEn,
        nameAr,
        parentId: emirateId,
        displayOrder,
        isActive,
        updatedAt: new Date()
      })
      .where(eq(addresses.id, id))
      .returning();

    if (!updatedArea) {
      return res.status(404).json({ error: 'Area not found' });
    }

    res.json(updatedArea);
  } catch (error) {
    console.error('Error updating area:', error);
    res.status(500).json({ error: 'Failed to update area' });
  }
});

export default router;