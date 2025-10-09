import express from 'express';
import { db } from '../../db.js';
import { inquiries, properties, users } from '../../shared/schema.js';
import { eq, desc } from 'drizzle-orm';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Submit inquiry
router.post('/', async (req, res) => {
  try {
    const { propertyId, name, email, phone, message, userId } = req.body;

    const newInquiry = await db.insert(inquiries).values({
      propertyId,
      userId: userId || null,
      name,
      email,
      phone,
      message
    }).returning();

    res.status(201).json({
      message: 'Inquiry submitted successfully',
      inquiry: newInquiry[0]
    });
  } catch (error) {
    console.error('Inquiry submission error:', error);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

// Get inquiries (admin/agent only)
router.get('/', authenticateToken, requireRole(['agent', 'admin', 'super_admin']), async (req: AuthRequest, res) => {
  try {
    const inquiriesList = await db.select({
      inquiry: inquiries,
      property: properties,
      user: users
    })
    .from(inquiries)
    .innerJoin(properties, eq(inquiries.propertyId, properties.id))
    .leftJoin(users, eq(inquiries.userId, users.id))
    .orderBy(desc(inquiries.createdAt));

    res.json(inquiriesList);
  } catch (error) {
    console.error('Inquiries fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// Get single inquiry
router.get('/:id', authenticateToken, requireRole(['agent', 'admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const inquiry = await db.select({
      inquiry: inquiries,
      property: properties,
      user: users
    })
    .from(inquiries)
    .innerJoin(properties, eq(inquiries.propertyId, properties.id))
    .leftJoin(users, eq(inquiries.userId, users.id))
    .where(eq(inquiries.id, id))
    .limit(1);

    if (!inquiry.length) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.json(inquiry[0]);
  } catch (error) {
    console.error('Inquiry fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch inquiry' });
  }
});

// Update inquiry status
router.put('/:id', authenticateToken, requireRole(['agent', 'admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedInquiry = await db.update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, id))
      .returning();

    if (!updatedInquiry.length) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.json({
      message: 'Inquiry status updated',
      inquiry: updatedInquiry[0]
    });
  } catch (error) {
    console.error('Inquiry update error:', error);
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

// Delete inquiry
router.delete('/:id', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db.delete(inquiries)
      .where(eq(inquiries.id, id))
      .returning();

    if (!deleted.length) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Inquiry deletion error:', error);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

export default router;