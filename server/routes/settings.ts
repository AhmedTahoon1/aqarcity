import { Router } from 'express';
import { db } from '../../db';
import { settings } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// GET default agent info
router.get('/default-agent', async (req, res) => {
  try {
    const result = await db.select().from(settings).where(eq(settings.key, 'default_agent')).limit(1);
    if (result.length > 0 && result[0].value) {
      res.json(JSON.parse(result[0].value));
    } else {
      res.json({ name: '', email: '', phone: '', whatsapp: '' });
    }
  } catch (error) {
    console.error('Error fetching default agent:', error);
    res.status(500).json({ error: 'Failed to fetch default agent' });
  }
});

// PUT default agent info (admin only)
router.put('/default-agent', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, whatsapp } = req.body;
    const value = JSON.stringify({ name, email, phone, whatsapp });

    const existing = await db.select().from(settings).where(eq(settings.key, 'default_agent')).limit(1);

    if (existing.length > 0) {
      const updated = await db
        .update(settings)
        .set({ value, updatedAt: new Date() })
        .where(eq(settings.key, 'default_agent'))
        .returning();
      res.json(JSON.parse(updated[0].value));
    } else {
      const created = await db
        .insert(settings)
        .values({
          key: 'default_agent',
          value,
          description: 'Default agent contact information',
        })
        .returning();
      res.json(JSON.parse(created[0].value));
    }
  } catch (error) {
    console.error('Error updating default agent:', error);
    res.status(500).json({ error: 'Failed to update default agent' });
  }
});

export default router;
