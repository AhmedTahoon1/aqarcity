import express from 'express';
import { db } from '../../db';
import { addresses } from '../../shared/schema';
import { eq, and, isNull } from 'drizzle-orm';

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
    const flatAddresses = await getFlatAddresses();
    res.json(flatAddresses);
  } catch (error) {
    console.error('Error fetching flat addresses:', error);
    res.status(500).json({ error: 'Failed to fetch flat addresses' });
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
async function getFlatAddresses() {
  const tree = await buildAddressTree();
  const flatList = [];

  function flattenTree(nodes, prefix = '') {
    nodes.forEach((node, index) => {
      const isLast = index === nodes.length - 1;
      const currentPrefix = prefix + (node.level === 0 ? '' : (isLast ? '└── ' : '├── '));
      
      flatList.push({
        ...node,
        displayName: currentPrefix + (node.nameEn || node.nameAr),
        displayNameAr: currentPrefix + (node.nameAr || node.nameEn)
      });

      if (node.children && node.children.length > 0) {
        const childPrefix = prefix + (node.level === 0 ? '' : (isLast ? '    ' : '│   '));
        flattenTree(node.children, childPrefix);
      }
    });
  }

  flattenTree(tree);
  return flatList;
}

export default router;