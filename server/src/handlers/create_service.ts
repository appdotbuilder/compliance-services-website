import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type CreateServiceInput, type Service } from '../schema';

export const createService = async (input: CreateServiceInput): Promise<Service> => {
  try {
    // Insert service record
    const result = await db.insert(servicesTable)
      .values({
        slug: input.slug,
        name: input.name,
        title: input.title,
        description: input.description,
        benefits: input.benefits,
        process_steps: input.process_steps,
        timeline: input.timeline,
        pricing_info: input.pricing_info || null
      })
      .returning()
      .execute();

    const service = result[0];
    return service;
  } catch (error) {
    console.error('Service creation failed:', error);
    throw error;
  }
};