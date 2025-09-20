import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type CreateServiceInput } from '../schema';
import { getServiceBySlug } from '../handlers/get_service_by_slug';

// Test service data
const testService: CreateServiceInput = {
  slug: 'soc2-compliance',
  name: 'SOC 2 Compliance',
  title: 'SOC 2 Type II Certification Services',
  description: 'Comprehensive SOC 2 compliance assessment and certification support for your organization. Our expert team guides you through every step of the process.',
  benefits: [
    'Enhanced security posture',
    'Customer trust and confidence',
    'Competitive advantage',
    'Risk mitigation'
  ],
  process_steps: [
    'Initial assessment and gap analysis',
    'Control implementation',
    'Documentation and policies',
    'Internal testing and validation',
    'External audit preparation'
  ],
  timeline: '3-6 months',
  pricing_info: 'Starting at $15,000'
};

const anotherTestService: CreateServiceInput = {
  slug: 'iso27001-certification',
  name: 'ISO 27001',
  title: 'ISO 27001 Certification Support',
  description: 'Complete ISO 27001 information security management system implementation and certification support for organizations of all sizes.',
  benefits: [
    'International recognition',
    'Systematic security approach',
    'Regulatory compliance',
    'Business continuity assurance'
  ],
  process_steps: [
    'ISMS scoping and planning',
    'Risk assessment and treatment',
    'Policy and procedure development',
    'Implementation and training',
    'Certification audit support'
  ],
  timeline: '6-12 months',
  pricing_info: null
};

describe('getServiceBySlug', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return a service when found by slug', async () => {
    // Create test service
    const insertResult = await db.insert(servicesTable)
      .values(testService)
      .returning()
      .execute();

    const createdService = insertResult[0];

    // Test the handler
    const result = await getServiceBySlug('soc2-compliance');

    expect(result).toBeDefined();
    expect(result?.id).toEqual(createdService.id);
    expect(result?.slug).toEqual('soc2-compliance');
    expect(result?.name).toEqual('SOC 2 Compliance');
    expect(result?.title).toEqual('SOC 2 Type II Certification Services');
    expect(result?.description).toEqual(testService.description);
    expect(result?.benefits).toEqual(testService.benefits);
    expect(result?.process_steps).toEqual(testService.process_steps);
    expect(result?.timeline).toEqual('3-6 months');
    expect(result?.pricing_info).toEqual('Starting at $15,000');
    expect(result?.created_at).toBeInstanceOf(Date);
    expect(result?.updated_at).toBeInstanceOf(Date);
  });

  it('should return null when service is not found', async () => {
    // Don't create any services
    const result = await getServiceBySlug('nonexistent-service');

    expect(result).toBeNull();
  });

  it('should return the correct service when multiple services exist', async () => {
    // Create multiple services
    await db.insert(servicesTable)
      .values([testService, anotherTestService])
      .execute();

    // Test fetching specific service
    const result = await getServiceBySlug('iso27001-certification');

    expect(result).toBeDefined();
    expect(result?.slug).toEqual('iso27001-certification');
    expect(result?.name).toEqual('ISO 27001');
    expect(result?.title).toEqual('ISO 27001 Certification Support');
    expect(result?.description).toEqual(anotherTestService.description);
    expect(result?.benefits).toEqual(anotherTestService.benefits);
    expect(result?.process_steps).toEqual(anotherTestService.process_steps);
    expect(result?.timeline).toEqual('6-12 months');
    expect(result?.pricing_info).toBeNull();
    expect(result?.created_at).toBeInstanceOf(Date);
    expect(result?.updated_at).toBeInstanceOf(Date);
  });

  it('should handle services with null pricing_info', async () => {
    // Create service with null pricing_info
    await db.insert(servicesTable)
      .values(anotherTestService)
      .execute();

    const result = await getServiceBySlug('iso27001-certification');

    expect(result).toBeDefined();
    expect(result?.pricing_info).toBeNull();
  });

  it('should be case-sensitive for slug matching', async () => {
    // Create service with lowercase slug
    await db.insert(servicesTable)
      .values(testService)
      .execute();

    // Try to find with different case
    const result = await getServiceBySlug('SOC2-COMPLIANCE');

    expect(result).toBeNull();
  });

  it('should handle empty string slug', async () => {
    const result = await getServiceBySlug('');

    expect(result).toBeNull();
  });

  it('should handle special characters in slug', async () => {
    const serviceWithSpecialChars: CreateServiceInput = {
      slug: 'gdpr-privacy-compliance',
      name: 'GDPR Privacy',
      title: 'GDPR Privacy Compliance Services',
      description: 'Comprehensive GDPR compliance assessment and ongoing privacy program management for European operations.',
      benefits: ['Data protection compliance', 'Avoid regulatory fines'],
      process_steps: ['Data mapping', 'Privacy impact assessments'],
      timeline: '2-4 months',
      pricing_info: 'Contact for pricing'
    };

    await db.insert(servicesTable)
      .values(serviceWithSpecialChars)
      .execute();

    const result = await getServiceBySlug('gdpr-privacy-compliance');

    expect(result).toBeDefined();
    expect(result?.slug).toEqual('gdpr-privacy-compliance');
    expect(result?.name).toEqual('GDPR Privacy');
  });
});