import { serial, text, pgTable, timestamp, pgEnum, json, integer } from 'drizzle-orm/pg-core';

// Enums for the database
export const serviceTypeEnum = pgEnum('service_type', ['SOC2', 'ISO27001', 'GDPR', 'General']);
export const contactStatusEnum = pgEnum('contact_status', ['new', 'contacted', 'in_progress', 'completed', 'closed']);

// Contact forms table
export const contactFormsTable = pgTable('contact_forms', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company'), // Nullable by default
  phone: text('phone'), // Nullable by default
  service: serviceTypeEnum('service').notNull(),
  message: text('message').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  status: contactStatusEnum('status').default('new').notNull(),
});

// Services table
export const servicesTable = pgTable('services', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  benefits: json('benefits').$type<string[]>().notNull(), // Array of benefit strings
  process_steps: json('process_steps').$type<string[]>().notNull(), // Array of process step strings
  timeline: text('timeline').notNull(),
  pricing_info: text('pricing_info'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Company information table (singleton table - should only have one row)
export const companyInfoTable = pgTable('company_info', {
  id: serial('id').primaryKey(),
  mission: text('mission').notNull(),
  values: json('values').$type<string[]>().notNull(), // Array of company values
  team_description: text('team_description').notNull(),
  founded_year: integer('founded_year').notNull(),
  contact_email: text('contact_email').notNull(),
  contact_phone: text('contact_phone'), // Nullable by default
  address: text('address'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// TypeScript types for the table schemas
export type ContactForm = typeof contactFormsTable.$inferSelect;
export type NewContactForm = typeof contactFormsTable.$inferInsert;
export type Service = typeof servicesTable.$inferSelect;
export type NewService = typeof servicesTable.$inferInsert;
export type CompanyInfo = typeof companyInfoTable.$inferSelect;
export type NewCompanyInfo = typeof companyInfoTable.$inferInsert;

// Export all tables for proper query building
export const tables = { 
  contactForms: contactFormsTable, 
  services: servicesTable,
  companyInfo: companyInfoTable
};