import { z } from 'zod';

// Contact form schema
export const contactFormSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  company: z.string().nullable(),
  phone: z.string().nullable(),
  service: z.enum(['SOC2', 'ISO27001', 'GDPR', 'General']),
  message: z.string(),
  created_at: z.coerce.date(),
  status: z.enum(['new', 'contacted', 'in_progress', 'completed', 'closed']).default('new')
});

export type ContactForm = z.infer<typeof contactFormSchema>;

// Input schema for creating contact form submissions
export const createContactFormInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  company: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  service: z.enum(['SOC2', 'ISO27001', 'GDPR', 'General']),
  message: z.string().min(10, 'Message must be at least 10 characters long')
});

export type CreateContactFormInput = z.infer<typeof createContactFormInputSchema>;

// Service information schema
export const serviceSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  title: z.string(),
  description: z.string(),
  benefits: z.array(z.string()),
  process_steps: z.array(z.string()),
  timeline: z.string(),
  pricing_info: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Service = z.infer<typeof serviceSchema>;

// Input schema for creating services
export const createServiceInputSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  name: z.string().min(1, 'Service name is required'),
  title: z.string().min(1, 'Service title is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  benefits: z.array(z.string().min(1)),
  process_steps: z.array(z.string().min(1)),
  timeline: z.string().min(1, 'Timeline is required'),
  pricing_info: z.string().nullable().optional()
});

export type CreateServiceInput = z.infer<typeof createServiceInputSchema>;

// Input schema for updating services
export const updateServiceInputSchema = z.object({
  id: z.number(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
  name: z.string().min(1, 'Service name is required').optional(),
  title: z.string().min(1, 'Service title is required').optional(),
  description: z.string().min(50, 'Description must be at least 50 characters').optional(),
  benefits: z.array(z.string().min(1)).optional(),
  process_steps: z.array(z.string().min(1)).optional(),
  timeline: z.string().min(1, 'Timeline is required').optional(),
  pricing_info: z.string().nullable().optional()
});

export type UpdateServiceInput = z.infer<typeof updateServiceInputSchema>;

// Company information schema
export const companyInfoSchema = z.object({
  id: z.number(),
  mission: z.string(),
  values: z.array(z.string()),
  team_description: z.string(),
  founded_year: z.number().int(),
  contact_email: z.string().email(),
  contact_phone: z.string().nullable(),
  address: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type CompanyInfo = z.infer<typeof companyInfoSchema>;

// Input schema for updating company info
export const updateCompanyInfoInputSchema = z.object({
  mission: z.string().min(20, 'Mission must be at least 20 characters').optional(),
  values: z.array(z.string().min(1)).optional(),
  team_description: z.string().min(50, 'Team description must be at least 50 characters').optional(),
  founded_year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().nullable().optional(),
  address: z.string().nullable().optional()
});

export type UpdateCompanyInfoInput = z.infer<typeof updateCompanyInfoInputSchema>;