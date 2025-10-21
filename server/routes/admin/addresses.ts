import express from 'express';
import { db } from '../../../db';
import { addresses, properties } from '../../../shared/schema';
import { eq, and, sql } from 'drizzle-orm';
import { authenticateToken, requireRole } from '../../middleware/auth';

const router = express.Router();

// GET /api/admin/addresses - Get all addresses with hierarchy
router.get('/', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const allAddresses = await db
      .select()
      .from(addresses)
      .orderBy(addresses.level, addresses.displayOrder);

    res.json(allAddresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// POST /api/admin/addresses - Create new address
router.post('/', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { nameEn, nameAr, parentId, level, displayOrder } = req.body;

    if (!nameEn || !nameAr || level === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate path
    let path = `/${nameEn.toLowerCase().replace(/\s+/g, '-')}`;
    if (parentId) {
      const parent = await db.select().from(addresses).where(eq(addresses.id, parentId)).limit(1);
      if (parent.length > 0 && parent[0].path) {
        path = `${parent[0].path}/${nameEn.toLowerCase().replace(/\s+/g, '-')}`;
      }
    }

    const newAddress = await db.insert(addresses).values({
      nameEn,
      nameAr,
      parentId: parentId || null,
      level,
      path,
      displayOrder: displayOrder || 0,
      isActive: true
    }).returning();

    res.status(201).json(newAddress[0]);
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ error: 'Failed to create address' });
  }
});

// PUT /api/admin/addresses/:id - Update address
router.put('/:id', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { nameEn, nameAr, parentId, displayOrder, isActive } = req.body;

    // Generate new path
    let path = `/${nameEn.toLowerCase().replace(/\s+/g, '-')}`;
    if (parentId) {
      const parent = await db.select().from(addresses).where(eq(addresses.id, parentId)).limit(1);
      if (parent.length > 0 && parent[0].path) {
        path = `${parent[0].path}/${nameEn.toLowerCase().replace(/\s+/g, '-')}`;
      }
    }

    const updatedAddress = await db
      .update(addresses)
      .set({
        nameEn,
        nameAr,
        parentId: parentId || null,
        path,
        displayOrder,
        isActive,
        updatedAt: new Date()
      })
      .where(eq(addresses.id, id))
      .returning();

    if (!updatedAddress.length) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json(updatedAddress[0]);
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
});

// DELETE /api/admin/addresses/:id - Delete address
router.delete('/:id', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if address has properties
    const propertiesCount = await db
      .select({ count: sql`count(*)` })
      .from(properties)
      .where(eq(properties.addressId, id));

    if (Number(propertiesCount[0].count) > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete address with associated properties',
        propertiesCount: Number(propertiesCount[0].count)
      });
    }

    // Check if address has children
    const childrenCount = await db
      .select({ count: sql`count(*)` })
      .from(addresses)
      .where(eq(addresses.parentId, id));

    if (Number(childrenCount[0].count) > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete address with child addresses',
        childrenCount: Number(childrenCount[0].count)
      });
    }

    const deletedAddress = await db
      .delete(addresses)
      .where(eq(addresses.id, id))
      .returning();

    if (!deletedAddress.length) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

// GET /api/admin/addresses/:id/properties-count - Get properties count for address
router.get('/:id/properties-count', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const count = await db
      .select({ count: sql`count(*)` })
      .from(properties)
      .where(eq(properties.addressId, id));

    res.json({ count: Number(count[0].count) });
  } catch (error) {
    console.error('Error getting properties count:', error);
    res.status(500).json({ error: 'Failed to get properties count' });
  }
});

export default router;