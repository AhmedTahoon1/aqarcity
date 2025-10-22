import { pgTable, uuid, varchar, text, decimal, integer, boolean, timestamp, json, pgEnum, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['buyer', 'agent', 'admin', 'super_admin']);
export const propertyStatusEnum = pgEnum('property_status', ['sale', 'rent']);
export const completionStatusEnum = pgEnum('completion_status', ['completed', 'under_construction']);
export const handoverStatusEnum = pgEnum('handover_status', ['ready', 'future']);
export const propertyTypeEnum = pgEnum('property_type', ['villa', 'apartment', 'townhouse', 'penthouse', 'land']);
export const inquiryStatusEnum = pgEnum('inquiry_status', ['new', 'contacted', 'closed']);
export const senderTypeEnum = pgEnum('sender_type', ['user', 'bot', 'agent']);
export const jobStatusEnum = pgEnum('job_status', ['active', 'closed']);
export const applicationStatusEnum = pgEnum('application_status', ['pending', 'reviewed', 'accepted', 'rejected']);
export const notificationTypeEnum = pgEnum('notification_type', ['new_property', 'price_drop', 'new_feature', 'system', 'marketing']);
export const notificationPriorityEnum = pgEnum('notification_priority', ['low', 'medium', 'high', 'urgent']);
export const alertFrequencyEnum = pgEnum('alert_frequency', ['instant', 'daily', 'weekly']);
export const contactTypeEnum = pgEnum('contact_type', ['email', 'whatsapp']);
export const linkStatusEnum = pgEnum('link_status', ['unlinked', 'auto_linked', 'user_linked', 'user_declined']);
export const sourceTypeEnum = pgEnum('source_type', ['user', 'guest_migrated', 'guest_linked']);

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  avatar: text('avatar'),
  password: text('password').notNull(),
  role: userRoleEnum('role').default('buyer').notNull(),
  languagePreference: varchar('language_preference', { length: 2 }).default('en'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    emailIdx: index('users_email_idx').on(table.email),
    roleIdx: index('users_role_idx').on(table.role),
  };
});

// Emirates Table (Main Cities)
export const emirates = pgTable('emirates', {
  id: uuid('id').primaryKey().defaultRandom(),
  nameEn: varchar('name_en', { length: 255 }).notNull(),
  nameAr: varchar('name_ar', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(true),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    activeIdx: index('emirates_active_idx').on(table.isActive),
  };
});

// Addresses Table (Hierarchical like WordPress Categories)
export const addresses = pgTable('addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  nameEn: varchar('name_en', { length: 255 }).notNull(),
  nameAr: varchar('name_ar', { length: 255 }).notNull(),
  parentId: uuid('parent_id').references(() => addresses.id), // NULL for main cities
  level: integer('level').notNull().default(0), // 0=Emirates, 1=Areas, 2=Sub-areas, etc.
  path: varchar('path', { length: 500 }), // /dubai/marina/tower-1 for breadcrumbs
  isActive: boolean('is_active').default(true),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    parentIdx: index('addresses_parent_idx').on(table.parentId),
    levelIdx: index('addresses_level_idx').on(table.level),
    pathIdx: index('addresses_path_idx').on(table.path),
    activeIdx: index('addresses_active_idx').on(table.isActive),
  };
});

// Developers Table
export const developers = pgTable('developers', {
  id: uuid('id').primaryKey().defaultRandom(),
  nameEn: varchar('name_en', { length: 255 }).notNull(),
  nameAr: varchar('name_ar', { length: 255 }).notNull(),
  logo: text('logo'),
  descriptionEn: text('description_en'),
  descriptionAr: text('description_ar'),
  projectsCount: integer('projects_count').default(0),
  website: text('website'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Agent Status and Specialization Enums
export const agentStatusEnum = pgEnum('agent_status', ['active', 'inactive', 'suspended', 'pending_verification']);
export const agentSpecializationEnum = pgEnum('agent_specialization', ['residential_sale', 'residential_rent', 'commercial_sale', 'commercial_rent', 'luxury_properties', 'off_plan', 'investment']);
export const agentLevelEnum = pgEnum('agent_level', ['junior', 'senior', 'team_leader', 'manager', 'director']);
export const companyTypeEnum = pgEnum('company_type', ['individual', 'small_team', 'medium_company', 'large_company', 'franchise']);

// Agents Table (Enhanced)
export const agents = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  
  // Basic Information
  bioEn: text('bio_en'),
  bioAr: text('bio_ar'),
  licenseNumber: varchar('license_number', { length: 100 }),
  licenseExpiryDate: timestamp('license_expires_at'),
  verified: boolean('verified').default(false),
  verifiedAt: timestamp('verified_at'),
  status: agentStatusEnum('status').default('pending_verification'),
  
  // Performance Metrics
  rating: decimal('rating', { precision: 2, scale: 1 }).default('0.0'),
  reviewsCount: integer('reviews_count').default(0),
  propertiesCount: integer('properties_count').default(0),
  activeListings: integer('active_listings').default(0),
  dealsClosed: integer('deals_closed').default(0),
  totalSalesValue: decimal('total_sales_value', { precision: 15, scale: 2 }).default('0.00'),
  averageDealValue: decimal('average_deal_value', { precision: 15, scale: 2 }).default('0.00'),
  responseTime: integer('avg_response_time_hours').default(24), // in hours
  
  // Contact Information
  phone: varchar('phone', { length: 20 }),
  whatsapp: varchar('whatsapp', { length: 20 }),
  email: varchar('email', { length: 255 }),
  website: text('website'),
  socialMedia: json('social_media').$type<{
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  }>().default({}),
  
  // Professional Details
  languages: json('languages').$type<string[]>().default([]),
  specializations: json('specializations').$type<string[]>().default([]),
  preferredAreas: json('preferred_areas').$type<string[]>().default([]),
  experienceYears: integer('experience_years').default(0),
  agentLevel: agentLevelEnum('agent_level').default('junior'),
  
  // Company Information
  companyName: varchar('company_name', { length: 255 }),
  companyLogo: text('company_logo'),
  companyType: companyTypeEnum('company_type').default('individual'),
  teamSize: integer('team_size').default(1),
  officeAddress: text('office_address'),
  
  // Availability & Working Hours
  workingHours: json('working_hours').$type<{
    monday?: { start: string; end: string; available: boolean };
    tuesday?: { start: string; end: string; available: boolean };
    wednesday?: { start: string; end: string; available: boolean };
    thursday?: { start: string; end: string; available: boolean };
    friday?: { start: string; end: string; available: boolean };
    saturday?: { start: string; end: string; available: boolean };
    sunday?: { start: string; end: string; available: boolean };
  }>().default({}),
  isAvailable: boolean('is_available').default(true),
  
  // Marketing & Profile
  profileImage: text('profile_image'),
  coverImage: text('cover_image'),
  achievements: json('achievements').$type<string[]>().default([]),
  certifications: json('certifications').$type<{
    name: string;
    issuer: string;
    dateObtained: string;
    expiryDate?: string;
    certificateUrl?: string;
  }[]>().default([]),
  
  // System Fields
  lastActiveAt: timestamp('last_active_at'),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    userIdx: index('agents_user_idx').on(table.userId),
    statusIdx: index('agents_status_idx').on(table.status),
    verifiedIdx: index('agents_verified_idx').on(table.verified),
    ratingIdx: index('agents_rating_idx').on(table.rating),
    levelIdx: index('agents_level_idx').on(table.agentLevel),
    availableIdx: index('agents_available_idx').on(table.isAvailable),
    licenseIdx: index('agents_license_idx').on(table.licenseNumber),
  };
});

// Agent Teams Table
export const agentTeams = pgTable('agent_teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  leadAgentId: uuid('lead_agent_id').references(() => agents.id).notNull(),
  companyName: varchar('company_name', { length: 255 }),
  logo: text('logo'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    leadIdx: index('agent_teams_lead_idx').on(table.leadAgentId),
    activeIdx: index('agent_teams_active_idx').on(table.isActive),
  };
});

// Agent Team Members Table
export const agentTeamMembers = pgTable('agent_team_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').references(() => agentTeams.id).notNull(),
  agentId: uuid('agent_id').references(() => agents.id).notNull(),
  role: varchar('role', { length: 100 }).default('member'), // member, co_leader, admin
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true),
}, (table) => {
  return {
    teamIdx: index('agent_team_members_team_idx').on(table.teamId),
    agentIdx: index('agent_team_members_agent_idx').on(table.agentId),
    activeIdx: index('agent_team_members_active_idx').on(table.isActive),
  };
});

// Agent Performance Metrics Table
export const agentMetrics = pgTable('agent_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentId: uuid('agent_id').references(() => agents.id).notNull(),
  month: integer('month').notNull(), // 1-12
  year: integer('year').notNull(),
  
  // Monthly Performance
  propertiesListed: integer('properties_listed').default(0),
  propertiesSold: integer('properties_sold').default(0),
  propertiesRented: integer('properties_rented').default(0),
  totalCommission: decimal('total_commission', { precision: 15, scale: 2 }).default('0.00'),
  leadsGenerated: integer('leads_generated').default(0),
  leadsConverted: integer('leads_converted').default(0),
  viewingsArranged: integer('viewings_arranged').default(0),
  clientMeetings: integer('client_meetings').default(0),
  
  // Quality Metrics
  averageResponseTime: integer('avg_response_time_minutes').default(0),
  customerSatisfactionScore: decimal('customer_satisfaction', { precision: 2, scale: 1 }).default('0.0'),
  repeatClientRate: decimal('repeat_client_rate', { precision: 3, scale: 2 }).default('0.00'), // percentage
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    agentIdx: index('agent_metrics_agent_idx').on(table.agentId),
    periodIdx: index('agent_metrics_period_idx').on(table.year, table.month),
  };
});

// Properties Table
export const properties = pgTable('properties', {
  id: uuid('id').primaryKey().defaultRandom(),
  referenceNumber: varchar('reference_number', { length: 50 }).unique().notNull(),
  titleEn: varchar('title_en', { length: 255 }).notNull(),
  titleAr: varchar('title_ar', { length: 255 }).notNull(),
  descriptionEn: text('description_en'),
  descriptionAr: text('description_ar'),
  location: varchar('location', { length: 255 }).notNull(),
  addressId: uuid('address_id').references(() => addresses.id).notNull(), // Main address (can be any level)
  areaName: varchar('area_name', { length: 100 }),
  coordinates: json('coordinates').$type<{ lat: number; lng: number }>(),
  price: decimal('price', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('AED'),
  status: propertyStatusEnum('status').notNull(),
  propertyType: propertyTypeEnum('property_type').notNull(),
  bedrooms: integer('bedrooms'),
  bathrooms: integer('bathrooms'),
  areaSqft: integer('area_sqft'),
  yearBuilt: integer('year_built'),
  features: json('features').$type<{
    amenities: string[];
    location: string[];
    security: string[];
  }>().default({ amenities: [], location: [], security: [] }),
  images: json('images').$type<string[]>().default([]),
  videoUrl: text('video_url'),
  completionStatus: completionStatusEnum('completion_status').default('completed'),
  handoverStatus: handoverStatusEnum('handover_status').default('ready'),
  handoverDate: varchar('handover_date', { length: 100 }),
  masterPlanImage: text('master_plan_image'),
  paymentPlans: json('payment_plans').$type<{type: string; description: string; monthlyPayment?: string; years?: number}[]>().default([]),
  propertyDescription: text('property_description'),
  agentId: uuid('agent_id').references(() => agents.id),
  developerId: uuid('developer_id').references(() => developers.id),
  isFeatured: boolean('is_featured').default(false),
  viewsCount: integer('views_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    addressIdx: index('properties_address_idx').on(table.addressId),
    propertyTypeIdx: index('properties_type_idx').on(table.propertyType),
    statusIdx: index('properties_status_idx').on(table.status),
    priceIdx: index('properties_price_idx').on(table.price),
    agentIdx: index('properties_agent_idx').on(table.agentId),
    featuredIdx: index('properties_featured_idx').on(table.isFeatured),
    createdAtIdx: index('properties_created_at_idx').on(table.createdAt),
  };
});

// Favorites Table
export const favorites = pgTable('favorites', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  propertyId: uuid('property_id').references(() => properties.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    userIdx: index('favorites_user_idx').on(table.userId),
    propertyIdx: index('favorites_property_idx').on(table.propertyId),
  };
});

// Inquiries Table
export const inquiries = pgTable('inquiries', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').references(() => properties.id).notNull(),
  userId: uuid('user_id').references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  message: text('message').notNull(),
  status: inquiryStatusEnum('status').default('new'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    propertyIdx: index('inquiries_property_idx').on(table.propertyId),
    userIdx: index('inquiries_user_idx').on(table.userId),
    statusIdx: index('inquiries_status_idx').on(table.status),
  };
});

// Chat Messages Table
export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  agentId: uuid('agent_id').references(() => agents.id),
  propertyId: uuid('property_id').references(() => properties.id),
  message: text('message').notNull(),
  senderType: senderTypeEnum('sender_type').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Reviews Table
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentId: uuid('agent_id').references(() => agents.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Jobs Table
export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  titleEn: varchar('title_en', { length: 255 }).notNull(),
  titleAr: varchar('title_ar', { length: 255 }).notNull(),
  descriptionEn: text('description_en').notNull(),
  descriptionAr: text('description_ar').notNull(),
  requirements: json('requirements').$type<string[]>().default([]),
  location: varchar('location', { length: 255 }).notNull(),
  salary: varchar('salary', { length: 100 }),
  jobType: varchar('job_type', { length: 50 }).notNull(),
  status: jobStatusEnum('status').default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Job Applications Table
export const jobApplications = pgTable('job_applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').references(() => jobs.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  cvUrl: text('cv_url').notNull(),
  coverLetter: text('cover_letter'),
  status: applicationStatusEnum('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Notifications Table
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

// Locations Table
export const locations = pgTable('locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  nameEn: varchar('name_en', { length: 255 }).notNull(),
  nameAr: varchar('name_ar', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  isActive: boolean('is_active').default(true),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Guest Searches Table
export const guestSearches = pgTable('guest_searches', {
  id: uuid('id').primaryKey().defaultRandom(),
  contactType: contactTypeEnum('contact_type').notNull(),
  contactValue: varchar('contact_value', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  searchCriteria: json('search_criteria').$type<{
    city?: string;
    area?: string;
    type?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    minArea?: number;
    maxArea?: number;
    coordinates?: { lat: number; lng: number }[];
    features?: {
      amenities?: string[];
      location?: string[];
      security?: string[];
    };
  }>().notNull(),
  alertsEnabled: boolean('alerts_enabled').default(true),
  alertFrequency: alertFrequencyEnum('alert_frequency').default('instant'),
  verificationToken: varchar('verification_token', { length: 255 }).notNull().unique(),
  isVerified: boolean('is_verified').default(false),
  verificationExpiresAt: timestamp('verification_expires_at'),
  lastAlertSent: timestamp('last_alert_sent'),
  isActive: boolean('is_active').default(true),
  linkedUserId: uuid('linked_user_id').references(() => users.id),
  linkStatus: linkStatusEnum('link_status').default('unlinked'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    contactIdx: index('guest_searches_contact_idx').on(table.contactValue),
    tokenIdx: index('guest_searches_token_idx').on(table.verificationToken),
    userIdx: index('guest_searches_user_idx').on(table.linkedUserId),
    activeIdx: index('guest_searches_active_idx').on(table.isActive),
  };
});

// Saved Searches Table
export const savedSearches = pgTable('saved_searches', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  searchCriteria: json('search_criteria').$type<{
    city?: string;
    area?: string;
    type?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    minArea?: number;
    maxArea?: number;
    coordinates?: { lat: number; lng: number }[];
    features?: {
      amenities?: string[];
      location?: string[];
      security?: string[];
    };
  }>().notNull(),
  alertsEnabled: boolean('alerts_enabled').default(true),
  alertFrequency: alertFrequencyEnum('alert_frequency').default('instant'),
  lastAlertSent: timestamp('last_alert_sent'),
  isActive: boolean('is_active').default(true),
  sourceType: sourceTypeEnum('source_type').default('user'),
  originalGuestId: uuid('original_guest_id').references(() => guestSearches.id),
  migrationDate: timestamp('migration_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    userIdx: index('saved_searches_user_idx').on(table.userId),
    activeIdx: index('saved_searches_active_idx').on(table.isActive),
    sourceIdx: index('saved_searches_source_idx').on(table.sourceType),
  };
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  agent: one(agents, { fields: [users.id], references: [agents.userId] }),
  favorites: many(favorites),
  inquiries: many(inquiries),
  chatMessages: many(chatMessages),
  reviews: many(reviews),
  savedSearches: many(savedSearches),
  linkedGuestSearches: many(guestSearches),
}));

export const agentsRelations = relations(agents, ({ one, many }) => ({
  user: one(users, { fields: [agents.userId], references: [users.id] }),
  properties: many(properties),
  chatMessages: many(chatMessages),
  reviews: many(reviews),
  teamMemberships: many(agentTeamMembers),
  ledTeams: many(agentTeams),
  metrics: many(agentMetrics),
}));

export const agentTeamsRelations = relations(agentTeams, ({ one, many }) => ({
  leadAgent: one(agents, { fields: [agentTeams.leadAgentId], references: [agents.id] }),
  members: many(agentTeamMembers),
}));

export const agentTeamMembersRelations = relations(agentTeamMembers, ({ one }) => ({
  team: one(agentTeams, { fields: [agentTeamMembers.teamId], references: [agentTeams.id] }),
  agent: one(agents, { fields: [agentTeamMembers.agentId], references: [agents.id] }),
}));

export const agentMetricsRelations = relations(agentMetrics, ({ one }) => ({
  agent: one(agents, { fields: [agentMetrics.agentId], references: [agents.id] }),
}));

export const emiratesRelations = relations(emirates, ({ many }) => ({
  properties: many(properties),
}));

export const addressesRelations = relations(addresses, ({ one, many }) => ({
  parent: one(addresses, { fields: [addresses.parentId], references: [addresses.id] }),
  children: many(addresses),
  properties: many(properties),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  agent: one(agents, { fields: [properties.agentId], references: [agents.id] }),
  developer: one(developers, { fields: [properties.developerId], references: [developers.id] }),
  address: one(addresses, { fields: [properties.addressId], references: [addresses.id] }),
  favorites: many(favorites),
  inquiries: many(inquiries),
  chatMessages: many(chatMessages),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, { fields: [favorites.userId], references: [users.id] }),
  property: one(properties, { fields: [favorites.propertyId], references: [properties.id] }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  property: one(properties, { fields: [inquiries.propertyId], references: [properties.id] }),
  user: one(users, { fields: [inquiries.userId], references: [users.id] }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, { fields: [chatMessages.userId], references: [users.id] }),
  agent: one(agents, { fields: [chatMessages.agentId], references: [agents.id] }),
  property: one(properties, { fields: [chatMessages.propertyId], references: [properties.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  agent: one(agents, { fields: [reviews.agentId], references: [agents.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));

export const jobsRelations = relations(jobs, ({ many }) => ({
  applications: many(jobApplications),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
  job: one(jobs, { fields: [jobApplications.jobId], references: [jobs.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const guestSearchesRelations = relations(guestSearches, ({ one }) => ({
  linkedUser: one(users, { fields: [guestSearches.linkedUserId], references: [users.id] }),
}));

export const savedSearchesRelations = relations(savedSearches, ({ one }) => ({
  user: one(users, { fields: [savedSearches.userId], references: [users.id] }),
  originalGuest: one(guestSearches, { fields: [savedSearches.originalGuestId], references: [guestSearches.id] }),
}));

// Property Features Management System
export const propertyFeatures = pgTable('property_features', {
  id: uuid('id').defaultRandom().primaryKey(),
  nameEn: varchar('name_en', { length: 100 }).notNull(),
  nameAr: varchar('name_ar', { length: 100 }).notNull(),
  category: varchar('category', { length: 20 }).notNull(), // amenities, location, security
  parentId: uuid('parent_id').references(() => propertyFeatures.id),
  level: integer('level').notNull().default(1), // 0=category, 1=feature
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    categoryIdx: index('property_features_category_idx').on(table.category),
    parentIdx: index('property_features_parent_idx').on(table.parentId),
    activeIdx: index('property_features_active_idx').on(table.isActive),
  };
});

// System Settings Table
export const settings = pgTable('settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 100 }).unique().notNull(),
  value: text('value'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    keyIdx: index('settings_key_idx').on(table.key),
  };
});

// Social Media Links Table
export const socialMediaLinks = pgTable('social_media_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  facebook: text('facebook'),
  instagram: text('instagram'),
  x: text('x'),
  snapchat: text('snapchat'),
  linkedin: text('linkedin'),
  tiktok: text('tiktok'),
  youtube: text('youtube'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Statistics Table
export const statistics = pgTable('statistics', {
  id: uuid('id').primaryKey().defaultRandom(),
  number: varchar('number', { length: 50 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }).notNull(),
  titleAr: varchar('title_ar', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 100 }).notNull(),
  isVisible: boolean('is_visible').default(true).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    visibleIdx: index('statistics_visible_idx').on(table.isVisible),
    orderIdx: index('statistics_order_idx').on(table.displayOrder),
  };
});

export const propertyFeaturesRelations = relations(propertyFeatures, ({ one, many }) => ({
  parent: one(propertyFeatures, { fields: [propertyFeatures.parentId], references: [propertyFeatures.id] }),
  children: many(propertyFeatures),
}));

export const settingsRelations = relations(settings, ({ }) => ({}));
export const socialMediaLinksRelations = relations(socialMediaLinks, ({ }) => ({}));
export const statisticsRelations = relations(statistics, ({ }) => ({}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;
export type AgentTeam = typeof agentTeams.$inferSelect;
export type NewAgentTeam = typeof agentTeams.$inferInsert;
export type AgentTeamMember = typeof agentTeamMembers.$inferSelect;
export type NewAgentTeamMember = typeof agentTeamMembers.$inferInsert;
export type AgentMetric = typeof agentMetrics.$inferSelect;
export type NewAgentMetric = typeof agentMetrics.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type Developer = typeof developers.$inferSelect;
export type NewDeveloper = typeof developers.$inferInsert;
export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
export type Emirate = typeof emirates.$inferSelect;
export type NewEmirate = typeof emirates.$inferInsert;
export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
export type SavedSearch = typeof savedSearches.$inferSelect;
export type NewSavedSearch = typeof savedSearches.$inferInsert;
export type GuestSearch = typeof guestSearches.$inferSelect;
export type NewGuestSearch = typeof guestSearches.$inferInsert;
export type PropertyFeature = typeof propertyFeatures.$inferSelect;
export type NewPropertyFeature = typeof propertyFeatures.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;
export type SocialMediaLink = typeof socialMediaLinks.$inferSelect;
export type NewSocialMediaLink = typeof socialMediaLinks.$inferInsert;
export type Statistic = typeof statistics.$inferSelect;
export type NewStatistic = typeof statistics.$inferInsert;