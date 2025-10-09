import express from 'express';
import { db } from '../../db.js';
import { notifications } from '../../shared/schema.js';
import { eq, and, desc, isNull, or } from 'drizzle-orm';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get user notifications
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { type, unread } = req.query;
    
    let whereConditions = or(
      eq(notifications.userId, req.user!.id),
      eq(notifications.isGlobal, true)
    );

    if (type && type !== 'all') {
      whereConditions = and(whereConditions, eq(notifications.type, type as any));
    }

    if (unread === 'true') {
      whereConditions = and(whereConditions, eq(notifications.isRead, false));
    }

    const userNotifications = await db.select().from(notifications)
      .where(whereConditions)
      .orderBy(desc(notifications.createdAt));
    
    res.json({ notifications: userNotifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
});

// Get unread count
router.get('/unread-count', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const count = await db.select({ count: notifications.id }).from(notifications)
      .where(
        and(
          or(
            eq(notifications.userId, req.user!.id),
            eq(notifications.isGlobal, true)
          ),
          eq(notifications.isRead, false)
        )
      );
    
    res.json({ count: count.length });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// Mark notification as read
router.put('/:id/read', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    await db.update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.id, id),
          or(
            eq(notifications.userId, req.user!.id),
            eq(notifications.isGlobal, true)
          )
        )
      );

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/read-all', authenticateToken, async (req: AuthRequest, res) => {
  try {
    await db.update(notifications)
      .set({ isRead: true })
      .where(
        or(
          eq(notifications.userId, req.user!.id),
          eq(notifications.isGlobal, true)
        )
      );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Delete notification
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const deleted = await db.delete(notifications)
      .where(
        and(
          eq(notifications.id, id),
          eq(notifications.userId, req.user!.id) // Only user's own notifications
        )
      )
      .returning();

    if (!deleted.length) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Get notification by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const notification = await db.select().from(notifications)
      .where(
        and(
          eq(notifications.id, id),
          or(
            eq(notifications.userId, req.user!.id),
            eq(notifications.isGlobal, true)
          )
        )
      )
      .limit(1);

    if (!notification.length) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ notification: notification[0] });
  } catch (error) {
    console.error('Get notification error:', error);
    res.status(500).json({ error: 'Failed to get notification' });
  }
});

export default router;