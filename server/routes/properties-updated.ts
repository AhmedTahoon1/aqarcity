import express from 'express';
import { db } from '../../db';
import { properties, agents, developers } from '../../shared/schema';
import { eq, and, gte, lte, ilike, desc, asc, sql } from 'drizzle-orm';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Transform property result with default contact info
const transformPropertyResult = (result: any) => ({
  property: {
    ...result.property,
    agent: result.agent ? {
      id: result.agent.id,
      phone: result.agent.phone,
      whatsapp: result.agent.whatsapp,
      email: result.agent.email
    } : {
      id: null,
      phone: '+971501234567',
      whatsapp: '+971501234567',
      email: 'info@aqarcity.ae'
    }
  },
  agent: result.agent,
  developer: result.developer
});

// Get all properties with filters
router.get('/', async (req, res) => {
  try {
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
    
    if (city) conditions.push(ilike(properties.city, `%${city}%`));
    if (area) conditions.push(ilike(properties.areaName, `%${area}%`));
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

    // Transform results with default contact info
    const transformedResults = results.map(transformPropertyResult);

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
    res.status(500).json({ error: 'Failed to fetch properties' });
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

    res.json(transformPropertyResult(result[0]));
  } catch (error) {
    console.error('Property fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create property (admin/agent only)
router.post('/', authenticateToken, requireRole(['agent', 'admin', 'super_admin']), async (req: AuthRequest, res) => {
  try {
    const propertyData = req.body;
    
    const newProperty = await db.insert(properties).values({
      ...propertyData,
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

    const transformedResults = featuredProperties.map(transformPropertyResult);
    res.json(transformedResults);
  } catch (error) {
    console.error('Featured properties fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch featured properties' });
  }
});

export default router;