import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { searchLinkingService } from '../services/search-linking';

const router = express.Router();

// اكتشاف البحوثات المحفوظة للضيوف
router.get('/discover-searches', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    const discoveredSearches = await searchLinkingService.discoverGuestSearches(user);
    
    // إضافة معاينة لكل بحث
    const searchesWithPreview = await Promise.all(
      discoveredSearches.map(async (search) => ({
        ...search,
        preview: await searchLinkingService.getSearchPreview(search.id)
      }))
    );

    res.json({ 
      searches: searchesWithPreview,
      count: discoveredSearches.length 
    });

  } catch (error) {
    console.error('Discover searches error:', error);
    res.status(500).json({ error: 'فشل في اكتشاف البحوثات' });
  }
});

// ربط البحوثات المحددة
router.post('/link-searches', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { searchIds } = req.body;
    const userId = req.user!.id;

    if (!searchIds || !Array.isArray(searchIds) || searchIds.length === 0) {
      return res.status(400).json({ error: 'معرفات البحوثات مطلوبة' });
    }

    await searchLinkingService.linkSearchesToUser(searchIds, userId);

    res.json({ 
      message: `تم ربط ${searchIds.length} بحث بنجاح`,
      linkedCount: searchIds.length 
    });

  } catch (error) {
    console.error('Link searches error:', error);
    res.status(500).json({ error: 'فشل في ربط البحوثات' });
  }
});

// رفض ربط البحوثات
router.post('/decline-searches', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { searchIds } = req.body;

    if (!searchIds || !Array.isArray(searchIds)) {
      return res.status(400).json({ error: 'معرفات البحوثات مطلوبة' });
    }

    await searchLinkingService.declineSearches(searchIds);

    res.json({ message: 'تم رفض ربط البحوثات' });

  } catch (error) {
    console.error('Decline searches error:', error);
    res.status(500).json({ error: 'فشل في رفض البحوثات' });
  }
});

export default router;