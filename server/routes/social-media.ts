import { Router } from 'express';
import { db } from '../../db';
import { socialMediaLinks } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET - Fetch social media links (public)
router.get('/', async (req, res) => {
  try {
    const links = await db.select().from(socialMediaLinks).limit(1);
    res.json(links[0] || {});
  } catch (error) {
    console.error('Error fetching social media links:', error);
    res.status(500).json({ error: 'Failed to fetch social media links' });
  }
});

// PUT - Update social media links (admin only)
router.put('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { facebook, instagram, x, snapchat, linkedin, tiktok, youtube } = req.body;

    const existing = await db.select().from(socialMediaLinks).limit(1);

    if (existing.length > 0) {
      const updated = await db
        .update(socialMediaLinks)
        .set({
          facebook: facebook || null,
          instagram: instagram || null,
          x: x || null,
          snapchat: snapchat || null,
          linkedin: linkedin || null,
          tiktok: tiktok || null,
          youtube: youtube || null,
          updatedAt: new Date(),
        })
        .where(eq(socialMediaLinks.id, existing[0].id))
        .returning();

      res.json(updated[0]);
    } else {
      const created = await db
        .insert(socialMediaLinks)
        .values({
          facebook: facebook || null,
          instagram: instagram || null,
          x: x || null,
          snapchat: snapchat || null,
          linkedin: linkedin || null,
          tiktok: tiktok || null,
          youtube: youtube || null,
        })
        .returning();

      res.json(created[0]);
    }
  } catch (error) {
    console.error('Error updating social media links:', error);
    res.status(500).json({ error: 'Failed to update social media links' });
  }
});

export default router;
