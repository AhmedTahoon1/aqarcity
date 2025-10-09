import express from 'express';
import { db } from '../../db.js';
import { properties, users, agents, inquiries, favorites } from '../../shared/schema.js';
import { count, sum, avg, desc, eq } from 'drizzle-orm';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get overview analytics (admin only)
router.get('/overview', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    // Get counts
    const [
      totalProperties,
      totalUsers,
      totalAgents,
      totalInquiries,
      totalFavorites
    ] = await Promise.all([
      db.select({ count: count() }).from(properties),
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(agents),
      db.select({ count: count() }).from(inquiries),
      db.select({ count: count() }).from(favorites)
    ]);

    // Get property stats
    const [
      avgPrice,
      totalViews,
      featuredCount
    ] = await Promise.all([
      db.select({ avg: avg(properties.price) }).from(properties),
      db.select({ sum: sum(properties.viewsCount) }).from(properties),
      db.select({ count: count() }).from(properties).where(eq(properties.isFeatured, true))
    ]);

    res.json({
      overview: {
        totalProperties: totalProperties[0].count,
        totalUsers: totalUsers[0].count,
        totalAgents: totalAgents[0].count,
        totalInquiries: totalInquiries[0].count,
        totalFavorites: totalFavorites[0].count
      },
      propertyStats: {
        averagePrice: avgPrice[0].avg || 0,
        totalViews: totalViews[0].sum || 0,
        featuredProperties: featuredCount[0].count
      }
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics overview' });
  }
});

// Get property analytics
router.get('/properties', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    // Most viewed properties
    const mostViewed = await db.select()
      .from(properties)
      .orderBy(desc(properties.viewsCount))
      .limit(10);

    // Properties by type
    const byType = await db.select({
      type: properties.propertyType,
      count: count()
    })
    .from(properties)
    .groupBy(properties.propertyType);

    // Properties by status
    const byStatus = await db.select({
      status: properties.status,
      count: count()
    })
    .from(properties)
    .groupBy(properties.status);

    // Properties by city
    const byCity = await db.select({
      city: properties.city,
      count: count()
    })
    .from(properties)
    .groupBy(properties.city);

    res.json({
      mostViewed,
      byType,
      byStatus,
      byCity
    });
  } catch (error) {
    console.error('Property analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch property analytics' });
  }
});

// Get market analytics
router.get('/market', async (req, res) => {
  try {
    // Average prices by property type
    const avgPricesByType = await db.select({
      type: properties.propertyType,
      avgPrice: avg(properties.price),
      count: count()
    })
    .from(properties)
    .groupBy(properties.propertyType);

    // Average prices by city
    const avgPricesByCity = await db.select({
      city: properties.city,
      avgPrice: avg(properties.price),
      count: count()
    })
    .from(properties)
    .groupBy(properties.city);

    // Price ranges
    const priceRanges = await db.select({
      range: 'Under 1M',
      count: count()
    })
    .from(properties)
    .where(eq(properties.price, '1000000'));

    res.json({
      avgPricesByType,
      avgPricesByCity,
      priceRanges
    });
  } catch (error) {
    console.error('Market analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch market analytics' });
  }
});

export default router;