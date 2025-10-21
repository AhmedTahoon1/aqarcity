import express from 'express';
import { db } from '../../db';
import { addresses, properties } from '../../shared/schema';
import { eq, and, isNull, sql } from 'drizzle-orm';

// Simple in-memory cache
let addressCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const router = express.Router();

// GET /api/addresses - Get all addresses hierarchically
router.get('/', async (req, res) => {
  try {
    const result = await buildAddressTree();
    res.json(result);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// GET /api/addresses/level/:level - Get addresses by level
router.get('/level/:level', async (req, res) => {
  try {
    const { level } = req.params;
    
    const addressesByLevel = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.level, parseInt(level)), eq(addresses.isActive, true)))
      .orderBy(addresses.displayOrder);

    res.json(addressesByLevel);
  } catch (error) {
    console.error('Error fetching addresses by level:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// GET /api/addresses/:id/children - Get children of specific address
router.get('/:id/children', async (req, res) => {
  try {
    const { id } = req.params;
    
    const children = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.parentId, id), eq(addresses.isActive, true)))
      .orderBy(addresses.displayOrder);

    res.json(children);
  } catch (error) {
    console.error('Error fetching address children:', error);
    res.status(500).json({ error: 'Failed to fetch address children' });
  }
});

// GET /api/addresses/:id/breadcrumb - Get breadcrumb path for address
router.get('/:id/breadcrumb', async (req, res) => {
  try {
    const { id } = req.params;
    const breadcrumb = await getAddressBreadcrumb(id);
    res.json(breadcrumb);
  } catch (error) {
    console.error('Error fetching breadcrumb:', error);
    res.status(500).json({ error: 'Failed to fetch breadcrumb' });
  }
});

// GET /api/addresses/flat - Get all addresses in flat structure for select dropdown
router.get('/flat', async (req, res) => {
  try {
    const { search, withStats } = req.query;
    
    // Check cache first (only for non-search requests)
    const now = Date.now();
    if (!search && addressCache && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('Serving addresses from cache');
      return res.json(addressCache);
    }
    
    // Add response headers
    res.set({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300', // 5 minutes browser cache
    });
    
    const flatAddresses = await getFlatAddresses(search as string, withStats === 'true');
    
    // Cache the result (only for non-search requests)
    if (!search) {
      addressCache = flatAddresses;
      cacheTimestamp = now;
      console.log('Cached addresses for future requests');
    }
    
    res.json(flatAddresses);
  } catch (error) {
    console.error('Error fetching flat addresses:', error);
    res.status(500).json({ 
      error: 'Failed to fetch flat addresses',
      message: error.message 
    });
  }
});

// GET /api/addresses/areas - Get all areas (level 1) for "All Areas" option
router.get('/areas', async (req, res) => {
  try {
    const allAreas = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.level, 1), eq(addresses.isActive, true)))
      .orderBy(addresses.displayOrder);

    res.json(allAreas);
  } catch (error) {
    console.error('Error fetching all areas:', error);
    res.status(500).json({ error: 'Failed to fetch all areas' });
  }
});

// Helper function to build address tree
async function buildAddressTree() {
  // Get all addresses
  const allAddresses = await db
    .select()
    .from(addresses)
    .where(eq(addresses.isActive, true))
    .orderBy(addresses.level, addresses.displayOrder);

  // Build tree structure
  const addressMap = new Map();
  const rootAddresses = [];

  // First pass: create map of all addresses
  allAddresses.forEach(address => {
    addressMap.set(address.id, { ...address, children: [] });
  });

  // Second pass: build tree structure
  allAddresses.forEach(address => {
    if (address.parentId) {
      const parent = addressMap.get(address.parentId);
      if (parent) {
        parent.children.push(addressMap.get(address.id));
      }
    } else {
      rootAddresses.push(addressMap.get(address.id));
    }
  });

  return rootAddresses;
}

// Helper function to get breadcrumb path
async function getAddressBreadcrumb(addressId: string) {
  const breadcrumb = [];
  let currentId = addressId;

  while (currentId) {
    const address = await db
      .select()
      .from(addresses)
      .where(eq(addresses.id, currentId))
      .limit(1);

    if (address.length === 0) break;

    breadcrumb.unshift(address[0]);
    currentId = address[0].parentId;
  }

  return breadcrumb;
}

// Helper function to get flat addresses with visual hierarchy
async function getFlatAddresses(searchTerm?: string, withStats: boolean = false) {
  // Get all addresses and property counts
  const allAddresses = await db.select().from(addresses).where(eq(addresses.isActive, true));
  const countResults = await db
    .select({
      addressId: properties.addressId,
      count: sql`count(*)`
    })
    .from(properties)
    .groupBy(properties.addressId);
  
  const directCounts = countResults.reduce((acc, item) => {
    acc[item.addressId] = Number(item.count);
    return acc;
  }, {});

  // Calculate total counts including children
  const calculateTotalCount = (addressId: string): number => {
    let total = directCounts[addressId] || 0;
    
    // Add counts from all children
    const children = allAddresses.filter(addr => addr.parentId === addressId);
    children.forEach(child => {
      total += calculateTotalCount(child.id);
    });
    
    return total;
  };

  // Build tree with counts
  const buildTreeWithCounts = () => {
    const addressMap = new Map();
    const rootAddresses = [];

    // Create map with counts
    allAddresses.forEach(address => {
      const totalCount = calculateTotalCount(address.id);
      addressMap.set(address.id, { 
        ...address, 
        children: [],
        totalCount
      });
    });

    // Build tree structure
    allAddresses.forEach(address => {
      const addressWithCount = addressMap.get(address.id);
      if (address.parentId) {
        const parent = addressMap.get(address.parentId);
        if (parent) {
          parent.children.push(addressWithCount);
        }
      } else {
        rootAddresses.push(addressWithCount);
      }
    });

    return rootAddresses;
  };

  const tree = buildTreeWithCounts();
  const flatList = [];

  function flattenTree(nodes, prefix = '') {
    nodes.forEach((node, index) => {
      // Only include if has properties
      if (node.totalCount > 0) {
        const isLast = index === nodes.length - 1;
        const currentPrefix = prefix + (node.level === 0 ? '' : (isLast ? '└── ' : '├── '));
        
        const addressItem = {
          ...node,
          displayName: currentPrefix + (node.nameEn || node.nameAr),
          displayNameAr: currentPrefix + (node.nameAr || node.nameEn),
          propertyCount: withStats ? node.totalCount : undefined
        };

        // Apply search filter if provided
        if (!searchTerm || 
            node.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.nameAr.includes(searchTerm)) {
          flatList.push(addressItem);
        }

        // Only process children if parent has properties
        if (node.children && node.children.length > 0) {
          const childPrefix = prefix + (node.level === 0 ? '' : (isLast ? '    ' : '│   '));
          flattenTree(node.children, childPrefix);
        }
      }
    });
  }

  flattenTree(tree);
  return flatList;
}

export default router;