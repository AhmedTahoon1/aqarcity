import { db } from '../../db';
import { guestSearches, savedSearches, users } from '../../shared/schema';
import { eq, and, inArray, or } from 'drizzle-orm';
import type { User, GuestSearch } from '../../shared/schema';

export class SearchLinkingService {
  async discoverGuestSearches(user: any): Promise<GuestSearch[]> {
    const conditions = [];
    
    // البحث بالإيميل
    if (user.email) {
      conditions.push(eq(guestSearches.contactValue, user.email));
    }
    
    // البحث برقم الهاتف
    if (user.phone) {
      conditions.push(eq(guestSearches.contactValue, user.phone));
    }

    if (conditions.length === 0) {
      return [];
    }

    const discoveredSearches = await db.select().from(guestSearches)
      .where(and(
        or(...conditions),
        eq(guestSearches.isVerified, true),
        eq(guestSearches.isActive, true),
        eq(guestSearches.linkStatus, 'unlinked')
      ));

    return discoveredSearches;
  }

  async linkSearchesToUser(searchIds: string[], userId: string): Promise<void> {
    const guestSearchesToLink = await db.select().from(guestSearches)
      .where(inArray(guestSearches.id, searchIds));

    for (const guestSearch of guestSearchesToLink) {
      // نقل البحث إلى saved_searches
      await db.insert(savedSearches).values({
        userId,
        name: guestSearch.name,
        searchCriteria: guestSearch.searchCriteria,
        alertsEnabled: guestSearch.alertsEnabled,
        alertFrequency: guestSearch.alertFrequency,
        sourceType: 'guest_migrated',
        originalGuestId: guestSearch.id,
        migrationDate: new Date(),
      });

      // تحديث حالة البحث الأصلي
      await db.update(guestSearches)
        .set({ 
          linkedUserId: userId, 
          linkStatus: 'user_linked',
          updatedAt: new Date()
        })
        .where(eq(guestSearches.id, guestSearch.id));
    }
  }

  async declineSearches(searchIds: string[]): Promise<void> {
    await db.update(guestSearches)
      .set({ 
        linkStatus: 'user_declined',
        updatedAt: new Date()
      })
      .where(inArray(guestSearches.id, searchIds));
  }

  async getSearchPreview(searchId: string): Promise<any> {
    const search = await db.select().from(guestSearches)
      .where(eq(guestSearches.id, searchId))
      .limit(1);

    if (!search.length) {
      return null;
    }

    const searchData = search[0];
    return {
      id: searchData.id,
      name: searchData.name,
      createdAt: searchData.createdAt,
      alertsEnabled: searchData.alertsEnabled,
      alertFrequency: searchData.alertFrequency,
      criteriaPreview: this.generateCriteriaPreview(searchData.searchCriteria)
    };
  }

  private generateCriteriaPreview(criteria: any): string {
    const parts = [];
    
    if (criteria.city) parts.push(criteria.city);
    if (criteria.type) parts.push(criteria.type);
    if (criteria.status) parts.push(criteria.status === 'sale' ? 'للبيع' : 'للإيجار');
    if (criteria.bedrooms) parts.push(`${criteria.bedrooms} غرف`);
    if (criteria.minPrice || criteria.maxPrice) {
      const priceRange = [];
      if (criteria.minPrice) priceRange.push(`من ${criteria.minPrice}`);
      if (criteria.maxPrice) priceRange.push(`إلى ${criteria.maxPrice}`);
      parts.push(priceRange.join(' '));
    }

    return parts.join(' • ') || 'بحث مخصص';
  }
}

export const searchLinkingService = new SearchLinkingService();