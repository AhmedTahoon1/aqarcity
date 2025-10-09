import { pgTable, uuid, varchar, text, boolean, timestamp, json, pgEnum } from 'drizzle-orm/pg-core';

export const notificationTypeEnum = pgEnum('notification_type', ['new_property', 'price_drop', 'new_feature', 'system', 'marketing']);
export const notificationPriorityEnum = pgEnum('notification_priority', ['low', 'medium', 'high', 'urgent']);

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  type: notificationTypeEnum('type').notNull(),
  priority: notificationPriorityEnum('priority').default('medium'),
  titleEn: varchar('title_en', { length: 255 }).notNull(),
  titleAr: varchar('title_ar', { length: 255 }).notNull(),
  contentEn: text('content_en').notNull(),
  contentAr: text('content_ar').notNull(),
  image: text('image'),
  videoUrl: text('video_url'),
  actionUrl: text('action_url'),
  actionTextEn: varchar('action_text_en', { length: 100 }),
  actionTextAr: varchar('action_text_ar', { length: 100 }),
  metadata: json('metadata').$type<{
    propertyId?: string;
    oldPrice?: number;
    newPrice?: number;
    location?: string;
  }>(),
  isRead: boolean('is_read').default(false),
  isGlobal: boolean('is_global').default(false),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

import { users } from './schema.js';

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;