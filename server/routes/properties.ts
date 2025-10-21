import express from 'express';
import { db } from '../../db';
import { properties, agents, developers, addresses } from '../../shared/schema';
import { eq, and, gte, lte, ilike, desc, asc, sql } from 'drizzle-orm';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';
import { transformPropertyResult } from '../utils/property-transformer';

const router = express.Router();

// Get all properties with filters
router.get('/', async (req, res) => {
  try {
    console.log('Properties API - Received query:', req.query);
    
    const {
      emirate,
      area,
      city,
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
      amenities,
      locationFeatures,
      security,
      features,
      page = 1,
      limit = 12,
      sort = 'newest'
    } = req.query;

    let query = db.select({
      property: properties,
      agent: agents,
      developer: developers,
      address: addresses
    })
    .from(properties)
    .leftJoin(agents, eq(properties.agentId, agents.id))
    .leftJoin(developers, eq(properties.developerId, developers.id))
    .leftJoin(addresses, eq(properties.addressId, addresses.id));

    // Apply filters
    const conditions = [];
    
    // Handle location filtering (new hierarchical system)
    if (location) {
      console.log('Filtering by location (address):', location);
      // Include the location itself and ALL its descendants (recursive)
      conditions.push(
        sql`(
          ${properties.addressId} = ${location} OR 
          ${properties.addressId} IN (
            WITH RECURSIVE address_tree AS (
              SELECT id FROM addresses WHERE parent_id = ${location}
              UNION ALL
              SELECT a.id FROM addresses a
              INNER JOIN address_tree at ON a.parent_id = at.id
            )
            SELECT id FROM address_tree
          )
        )`
      );
    }
    
    // Handle emirate/area filtering (legacy support)
    if (area && !location) {
      console.log('Filtering by area:', area);
      conditions.push(eq(properties.addressId, area));
    } else if (emirate && !location) {
      console.log('Filtering by emirate:', emirate);
      conditions.push(
        sql`${properties.addressId} IN (
          SELECT id FROM addresses 
          WHERE parent_id = ${emirate} OR id = ${emirate}
        )`
      );
    }
    
    // Legacy city/area filters (for backward compatibility)
    if (city && !location) {
      // Handle both Arabic and English city names
      const cityMappings = {
        'Dubai': 'دبي',
        'Abu Dhabi': 'أبوظبي', 
        'Sharjah': 'الشارقة',
        'Ajman': 'عجمان',
        'Ras Al Khaimah': 'رأس الخيمة',
        'Fujairah': 'الفجيرة',
        'Umm Al Quwain': 'أم القيوين'
      };
      const arabicCity = cityMappings[city] || city;
      conditions.push(
        sql`(${ilike(properties.location, `%${city}%`)} OR ${ilike(properties.location, `%${arabicCity}%`)})`
      );
    }

    if (type) conditions.push(eq(properties.propertyType, type as any));
    if (status) conditions.push(eq(properties.status, status as any));
    if (minPrice) conditions.push(gte(properties.price, minPrice.toString()));
    if (maxPrice) conditions.push(lte(properties.price, maxPrice.toString()));
    if (bedrooms) conditions.push(eq(properties.bedrooms, Number(bedrooms)));
    if (bathrooms) conditions.push(eq(properties.bathrooms, Number(bathrooms)));
    if (minArea) conditions.push(gte(properties.areaSqft, Number(minArea)));
    if (maxArea) conditions.push(lte(properties.areaSqft, Number(maxArea)));
    if (featured === 'true') conditions.push(eq(properties.isFeatured, true));
    
    // Features filtering - handle both old format and new structured format
    if (features && typeof features === 'string') {
      try {
        const parsedFeatures = JSON.parse(features);
        
        // Amenities filtering
        if (parsedFeatures.amenities && parsedFeatures.amenities.length > 0) {
          parsedFeatures.amenities.forEach((amenity: string) => {
            conditions.push(sql`${properties.features}::jsonb -> 'amenities' ? ${amenity}`);
          });
        }
        
        // Location features filtering
        if (parsedFeatures.location && parsedFeatures.location.length > 0) {
          parsedFeatures.location.forEach((feature: string) => {
            conditions.push(sql`${properties.features}::jsonb -> 'location' ? ${feature}`);
          });
        }
        
        // Security features filtering
        if (parsedFeatures.security && parsedFeatures.security.length > 0) {
          parsedFeatures.security.forEach((feature: string) => {
            conditions.push(sql`${properties.features}::jsonb -> 'security' ? ${feature}`);
          });
        }
      } catch (e) {
        console.log('Error parsing features:', e);
      }
    }
    
    // Legacy individual feature filters (for backward compatibility)
    if (amenities) {
      const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
      amenitiesArray.forEach(amenity => {
        conditions.push(sql`${properties.features}::jsonb -> 'amenities' ? ${amenity}`);
      });
    }
    
    if (locationFeatures) {
      const locationArray = Array.isArray(locationFeatures) ? locationFeatures : [locationFeatures];
      locationArray.forEach(feature => {
        conditions.push(sql`${properties.features}::jsonb -> 'location' ? ${feature}`);
      });
    }
    
    if (security) {
      const securityArray = Array.isArray(security) ? security : [security];
      securityArray.forEach(feature => {
        conditions.push(sql`${properties.features}::jsonb -> 'security' ? ${feature}`);
      });
    }

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

    // Get total count for pagination with same conditions
    let countQuery = db.select({ count: sql`count(*)` })
      .from(properties)
      .leftJoin(addresses, eq(properties.addressId, addresses.id));
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
      developer: developers,
      address: addresses
    })
    .from(properties)
    .leftJoin(agents, eq(properties.agentId, agents.id))
    .leftJoin(developers, eq(properties.developerId, developers.id))
    .leftJoin(addresses, eq(properties.addressId, addresses.id))
    .where(eq(properties.id, id))
    .limit(1);

    if (!result.length) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Increment view count
    await db.update(properties)
      .set({ viewsCount: result[0].property.viewsCount + 1 })
      .where(eq(properties.id, id));

    const transformedResult = {
      ...result[0],
      property: {
        ...result[0].property,
        location: result[0].address ? result[0].address.nameEn : result[0].property.location,
        areaName: result[0].address ? result[0].address.nameAr : result[0].property.areaName
      }
    };
    
    res.json(transformedResult);
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