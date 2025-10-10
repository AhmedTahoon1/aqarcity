import express from 'express';
import { db } from '../../db';
import { properties, agents, developers } from '../../shared/schema';
import { eq, and, gte, lte, ilike, desc, asc, sql } from 'drizzle-orm';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';
import { transformPropertyResult } from '../utils/property-transformer';

const router = express.Router();

// Get all properties with filters
router.get('/', async (req, res) => {
  try {
    console.log('Properties API - Received query:', req.query);
    
    const {
      city,
      area,
      location,
      type,
      status,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      featured,
      page = 1,
      limit = 12,
      sort = 'newest'
    } = req.query;

    let query = db.select({
      property: properties,
      agent: agents,
      developer: developers
    })
    .from(properties)
    .leftJoin(agents, eq(properties.agentId, agents.id))
    .leftJoin(developers, eq(properties.developerId, developers.id));

    // Apply filters
    const conditions = [];
    
    // Handle location filtering - simplified approach
    if (location) {
      console.log('Filtering by location:', location);
      // Simple location filtering by treating location as city name
      conditions.push(
        sql`(${ilike(properties.city, `%${location}%`)} OR ${ilike(properties.areaName, `%${location}%`)})`
      );
    }
    
    // Legacy city/area filters (for backward compatibility)
    if (city && !location) conditions.push(ilike(properties.city, `%${city}%`));
    if (area && !location) conditions.push(ilike(properties.areaName, `%${area}%`));
    if (type) conditions.push(eq(properties.propertyType, type as any));
    if (status) conditions.push(eq(properties.status, status as any));
    if (minPrice) conditions.push(gte(properties.price, minPrice.toString()));
    if (maxPrice) conditions.push(lte(properties.price, maxPrice.toString()));
    if (bedrooms) conditions.push(eq(properties.bedrooms, Number(bedrooms)));
    if (bathrooms) conditions.push(eq(properties.bathrooms, Number(bathrooms)));
    if (minArea) conditions.push(gte(properties.areaSqft, Number(minArea)));
    if (maxArea) conditions.push(lte(properties.areaSqft, Number(maxArea)));
    if (featured === 'true') conditions.push(eq(properties.isFeatured, true));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    switch (sort) {
      case 'price_asc':
        query = query.orderBy(asc(properties.price));
        break;
      case 'price_desc':
        query = query.orderBy(desc(properties.price));
        break;
      case 'oldest':
        query = query.orderBy(asc(properties.createdAt));
        break;
      default:
        query = query.orderBy(desc(properties.createdAt));
    }

    // Get total count for pagination
    let countQuery = db.select({ count: sql`count(*)` }).from(properties);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }
    const totalResult = await countQuery;
    const total = Number(totalResult[0].count);

    // Apply pagination
    const offset = (Number(page) - 1) * Number(limit);
    const results = await query.limit(Number(limit)).offset(offset);

    // Transform results to include agent info in property object
    const transformedResults = results.map(result => ({
      property: {
        ...result.property,
        agent: result.agent ? {
          id: result.agent.id,
          phone: result.agent.phone,
          whatsapp: result.agent.whatsapp,
          email: result.agent.email
        } : null
      },
      agent: result.agent,
      developer: result.developer
    }));

    res.json({
      properties: transformedResults,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Properties fetch error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch properties',
      details: error.message,
      query: req.query
    });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.select({
      property: properties,
      agent: agents,
      developer: developers
    })
    .from(properties)
    .leftJoin(agents, eq(properties.agentId, agents.id))
    .leftJoin(developers, eq(properties.developerId, developers.id))
    .where(eq(properties.id, id))
    .limit(1);

    if (!result.length) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Increment view count
    await db.update(properties)
      .set({ viewsCount: result[0].property.viewsCount + 1 })
      .where(eq(properties.id, id));

    res.json(result[0]);
  } catch (error) {
    console.error('Property fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create property (admin/agent only)
router.post('/', authenticateToken, requireRole(['agent', 'admin', 'super_admin']), async (req: AuthRequest, res) => {
  try {
    const propertyData = req.body;
    
    // Allow flexible property creation
    const newProperty = await db.insert(properties).values({
      ...propertyData,
      // agentId and developerId are optional - can be null
      agentId: propertyData.agentId || null,
      developerId: propertyData.developerId || null
    }).returning();

    res.status(201).json({
      message: 'Property created successfully',
      property: newProperty[0]
    });
  } catch (error) {
    console.error('Property creation error:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property
router.put('/:id', authenticateToken, requireRole(['agent', 'admin', 'super_admin']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedProperty = await db.update(properties)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();

    if (!updatedProperty.length) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({
      message: 'Property updated successfully',
      property: updatedProperty[0]
    });
  } catch (error) {
    console.error('Property update error:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete property
router.delete('/:id', authenticateToken, requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedProperty = await db.delete(properties)
      .where(eq(properties.id, id))
      .returning();

    if (!deletedProperty.length) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Property deletion error:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// Get featured properties
router.get('/featured/list', async (req, res) => {
  try {
    const featuredProperties = await db.select({
      property: properties,
      agent: agents,
      developer: developers
    })
    .from(properties)
    .leftJoin(agents, eq(properties.agentId, agents.id))
    .leftJoin(developers, eq(properties.developerId, developers.id))
    .where(eq(properties.isFeatured, true))
    .orderBy(desc(properties.createdAt))
    .limit(6);

    // Transform results to include agent info in property object
    const transformedResults = featuredProperties.map(result => ({
      property: {
        ...result.property,
        agent: result.agent ? {
          id: result.agent.id,
          phone: result.agent.phone,
          whatsapp: result.agent.whatsapp,
          email: result.agent.email
        } : null
      },
      agent: result.agent,
      developer: result.developer
    }));

    res.json(transformedResults);
  } catch (error) {
    console.error('Featured properties fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch featured properties' });
  }
});

// Get archived properties (sold/unavailable)
router.get('/archive', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = 'newest'
    } = req.query;

    let query = db.select({
      property: properties,
      agent: agents,
      developer: developers
    })
    .from(properties)
    .leftJoin(agents, eq(properties.agentId, agents.id))
    .leftJoin(developers, eq(properties.developerId, developers.id))
    .where(eq(properties.status, 'sold'));

    // Apply sorting
    switch (sort) {
      case 'price_asc':
        query = query.orderBy(asc(properties.price));
        break;
      case 'price_desc':
        query = query.orderBy(desc(properties.price));
        break;
      case 'oldest':
        query = query.orderBy(asc(properties.createdAt));
        break;
      default:
        query = query.orderBy(desc(properties.createdAt));
    }

    // Get total count for pagination
    const totalResult = await db.select({ count: sql`count(*)` })
      .from(properties)
      .where(eq(properties.status, 'sold'));
    const total = Number(totalResult[0].count);

    // Apply pagination
    const offset = (Number(page) - 1) * Number(limit);
    const results = await query.limit(Number(limit)).offset(offset);

    // Transform results to include agent info in property object
    const transformedResults = results.map(result => ({
      property: {
        ...result.property,
        agent: result.agent ? {
          id: result.agent.id,
          phone: result.agent.phone,
          whatsapp: result.agent.whatsapp,
          email: result.agent.email
        } : null
      },
      agent: result.agent,
      developer: result.developer
    }));

    res.json({
      properties: transformedResults,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Archived properties fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch archived properties' });
  }
});

export default router;