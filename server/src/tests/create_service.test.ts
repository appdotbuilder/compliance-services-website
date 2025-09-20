import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type CreateServiceInput } from '../schema';
import { createService } from '../handlers/create_service';
import { eq } from 'drizzle-orm';

// Complete test input with all required fields
const testInput: CreateServiceInput = {
  slug: 'test-service',
  name: 'Test Service',
  title: 'Professional Test Service',
  description: 'This is a comprehensive test service description that meets the minimum character requirement for testing purposes.',
  benefits: [
    'Improved compliance posture',
    'Reduced regulatory risk',
    'Enhanced security framework'
  ],
  process_steps: [
    'Initial assessment',
    'Gap analysis',
    'Implementation planning',
    'Execution and monitoring'
  ],
  timeline: '3-6 months',
  pricing_info: 'Starting at $10,000'
};

describe('createService', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a service with all fields', async () => {
    const result = await createService(testInput);

    // Verify all field values
    expect(result.slug).toEqual('test-service');
    expect(result.name).toEqual('Test Service');
    expect(result.title).toEqual('Professional Test Service');
    expect(result.description).toEqual(testInput.description);
    expect(result.benefits).toEqual(testInput.benefits);
    expect(result.process_steps).toEqual(testInput.process_steps);
    expect(result.timeline).toEqual('3-6 months');
    expect(result.pricing_info).toEqual('Starting at $10,000');
    
    // Verify auto-generated fields
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('number');
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a service with null pricing_info', async () => {
    const inputWithoutPricing: CreateServiceInput = {
      ...testInput,
      pricing_info: null
    };

    const result = await createService(inputWithoutPricing);

    expect(result.pricing_info).toBeNull();
    expect(result.slug).toEqual(testInput.slug);
    expect(result.name).toEqual(testInput.name);
  });

  it('should save service to database', async () => {
    const result = await createService(testInput);

    // Query the database to verify persistence
    const services = await db.select()
      .from(servicesTable)
      .where(eq(servicesTable.id, result.id))
      .execute();

    expect(services).toHaveLength(1);
    const savedService = services[0];
    
    expect(savedService.slug).toEqual('test-service');
    expect(savedService.name).toEqual('Test Service');
    expect(savedService.title).toEqual('Professional Test Service');
    expect(savedService.description).toEqual(testInput.description);
    expect(savedService.benefits).toEqual(testInput.benefits);
    expect(savedService.process_steps).toEqual(testInput.process_steps);
    expect(savedService.timeline).toEqual('3-6 months');
    expect(savedService.pricing_info).toEqual('Starting at $10,000');
    expect(savedService.created_at).toBeInstanceOf(Date);
    expect(savedService.updated_at).toBeInstanceOf(Date);
  });

  it('should handle array fields correctly', async () => {
    const complexInput: CreateServiceInput = {
      ...testInput,
      benefits: [
        'Comprehensive compliance assessment',
        'Risk mitigation strategies',
        'Ongoing monitoring and support',
        'Expert consultation services'
      ],
      process_steps: [
        'Stakeholder interviews and requirements gathering',
        'Current state assessment and gap analysis',
        'Control implementation and testing',
        'Documentation and training delivery',
        'Continuous improvement monitoring'
      ]
    };

    const result = await createService(complexInput);

    expect(result.benefits).toHaveLength(4);
    expect(result.process_steps).toHaveLength(5);
    expect(result.benefits[0]).toEqual('Comprehensive compliance assessment');
    expect(result.process_steps[4]).toEqual('Continuous improvement monitoring');
  });

  it('should enforce unique slug constraint', async () => {
    // Create first service
    await createService(testInput);

    // Attempt to create second service with same slug
    const duplicateInput: CreateServiceInput = {
      ...testInput,
      name: 'Different Service Name',
      title: 'Different Title'
    };

    await expect(createService(duplicateInput)).rejects.toThrow(/duplicate key value violates unique constraint|UNIQUE constraint failed/i);
  });

  it('should handle special characters in text fields', async () => {
    const specialCharInput: CreateServiceInput = {
      slug: 'special-chars-test',
      name: 'Service with "Quotes" & Special Chars',
      title: 'Title with <HTML> & JSON {"key": "value"} Content',
      description: 'Description with special characters: @#$%^&*(){}[]|\\:";\'<>?,./ and unicode: 🔒 ✅ 📊',
      benefits: [
        'Benefit with "quotes" and & ampersands',
        'Unicode support: ✨ 🚀 💡'
      ],
      process_steps: [
        'Step with <XML/> tags and {JSON: "objects"}',
        'SQL injection test: \'; DROP TABLE services; --'
      ],
      timeline: 'Timeline with special chars: 2-4 months (±2 weeks)',
      pricing_info: 'Pricing: $5,000-$15,000 (varies by scope)'
    };

    const result = await createService(specialCharInput);

    expect(result.name).toEqual('Service with "Quotes" & Special Chars');
    expect(result.title).toContain('<HTML>');
    expect(result.description).toContain('🔒 ✅ 📊');
    expect(result.benefits[1]).toContain('✨ 🚀 💡');
    expect(result.process_steps[1]).toContain('DROP TABLE');
    expect(result.timeline).toContain('±2');
    expect(result.pricing_info).toContain('$5,000-$15,000');
  });

  it('should set correct timestamps', async () => {
    const beforeCreate = new Date();
    const result = await createService(testInput);
    const afterCreate = new Date();

    expect(result.created_at.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
    expect(result.created_at.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    expect(result.updated_at.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
    expect(result.updated_at.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
  });
});