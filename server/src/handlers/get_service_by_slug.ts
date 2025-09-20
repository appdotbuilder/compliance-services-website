import { db } from '../db';
import { servicesTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type Service } from '../schema';

export const getServiceBySlug = async (slug: string): Promise<Service | null> => {
  try {
    const results = await db.select()
      .from(servicesTable)
      .where(eq(servicesTable.slug, slug))
      .limit(1)
      .execute();

    if (results.length === 0) {
      return null;
    }

    const service = results[0];
    return {
      id: service.id,
      slug: service.slug,
      name: service.name,
      title: service.title,
      description: service.description,
      benefits: service.benefits,
      process_steps: service.process_steps,
      timeline: service.timeline,
      pricing_info: service.pricing_info,
      created_at: service.created_at,
      updated_at: service.updated_at
    };
  } catch (error) {
    console.error('Failed to fetch service by slug:', error);
    throw error;
  }
};