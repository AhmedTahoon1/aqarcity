import { pgTable, uuid, varchar, text, decimal, integer, boolean, timestamp, json } from 'drizzle-orm/pg-core';

// Current agents table schema (existing fields only)
export const currentAgents = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  bioEn: text('bio_en'),
  bioAr: text('bio_ar'),
  licenseNumber: varchar('license_number', { length: 100 }),
  verified: boolean('verified').default(false),
  rating: decimal('rating', { precision: 2, scale: 1 }).default('0.0'),
  languages: json('languages').$type<string[]>().default([]),
  propertiesCount: integer('properties_count').default(0),
  dealsClosed: integer('deals_closed').default(0),
  phone: varchar('phone', { length: 20 }),
  whatsapp: varchar('whatsapp', { length: 20 }),
  email: varchar('email', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});