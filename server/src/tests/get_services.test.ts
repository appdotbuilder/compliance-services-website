import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type CreateServiceInput } from '../schema';
import { getServices } from '../handlers/get_services';

// Test data for services
const testService1: CreateServiceInput = {
  slug: 'soc2-compliance',
  name: 'SOC 2',
  title: 'SOC 2 Compliance Services',
  description: 'Comprehensive SOC 2 compliance assessment and certification support for your organization. We help you implement the necessary controls and processes.',
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

const testService2: CreateServiceInput = {
  slug: 'iso27001-certification',
  name: 'ISO 27001',
  title: 'ISO 27001 Certification Support',
  description: 'Complete ISO 27001 information security management system implementation and certification. Our experts guide you through every step.',
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

const testService3: CreateServiceInput = {
  slug: 'gdpr-compliance',
  name: 'GDPR',
  title: 'GDPR Compliance Services', 
  description: 'Comprehensive GDPR compliance assessment and ongoing privacy program management to ensure data protection compliance.',
  benefits: [
    'Data protection compliance',
    'Avoid regulatory fines',
    'Enhanced data governance',
    'Customer privacy protection'
  ],
  process_steps: [
    'Data mapping and inventory',
    'Privacy impact assessments',
    'Policy and procedure updates',
    'Staff training and awareness',
    'Ongoing compliance monitoring'
  ],
  timeline: '2-4 months',
  pricing_info: 'Contact for pricing'
};

describe('getServices', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no services exist', async () => {
    const result = await getServices();
    
    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return all services from database', async () => {
    // Insert test services
    await db.insert(servicesTable)
      .values([
        {
          slug: testService1.slug,
          name: testService1.name,
          title: testService1.title,
          description: testService1.description,
          benefits: testService1.benefits,
          process_steps: testService1.process_steps,
          timeline: testService1.timeline,
          pricing_info: testService1.pricing_info
        },
        {
          slug: testService2.slug,
          name: testService2.name,
          title: testService2.title,
          description: testService2.description,
          benefits: testService2.benefits,
          process_steps: testService2.process_steps,
          timeline: testService2.timeline,
          pricing_info: testService2.pricing_info
        },
        {
          slug: testService3.slug,
          name: testService3.name,
          title: testService3.title,
          description: testService3.description,
          benefits: testService3.benefits,
          process_steps: testService3.process_steps,
          timeline: testService3.timeline,
          pricing_info: testService3.pricing_info
        }
      ])
      .execute();

    const result = await getServices();

    expect(result).toHaveLength(3);
    
    // Verify service structure and data
    const soc2Service = result.find(service => service.slug === 'soc2-compliance');
    expect(soc2Service).toBeDefined();
    expect(soc2Service?.name).toEqual('SOC 2');
    expect(soc2Service?.title).toEqual('SOC 2 Compliance Services');
    expect(soc2Service?.description).toEqual(testService1.description);
    expect(soc2Service?.benefits).toEqual(testService1.benefits);
    expect(soc2Service?.process_steps).toEqual(testService1.process_steps);
    expect(soc2Service?.timeline).toEqual('3-6 months');
    expect(soc2Service?.pricing_info).toEqual('Starting at $15,000');
    expect(soc2Service?.id).toBeDefined();
    expect(soc2Service?.created_at).toBeInstanceOf(Date);
    expect(soc2Service?.updated_at).toBeInstanceOf(Date);

    const iso27001Service = result.find(service => service.slug === 'iso27001-certification');
    expect(iso27001Service).toBeDefined();
    expect(iso27001Service?.name).toEqual('ISO 27001');
    expect(iso27001Service?.pricing_info).toBeNull();

    const gdprService = result.find(service => service.slug === 'gdpr-compliance');
    expect(gdprService).toBeDefined();
    expect(gdprService?.name).toEqual('GDPR');
    expect(gdprService?.pricing_info).toEqual('Contact for pricing');
  });

  it('should return services with correct JSON array fields', async () => {
    // Insert service with complex JSON arrays
    await db.insert(servicesTable)
      .values({
        slug: testService1.slug,
        name: testService1.name,
        title: testService1.title,
        description: testService1.description,
        benefits: testService1.benefits,
        process_steps: testService1.process_steps,
        timeline: testService1.timeline,
        pricing_info: testService1.pricing_info
      })
      .execute();

    const result = await getServices();
    
    expect(result).toHaveLength(1);
    const service = result[0];
    
    // Verify JSON arrays are properly parsed
    expect(Array.isArray(service.benefits)).toBe(true);
    expect(service.benefits).toHaveLength(4);
    expect(service.benefits[0]).toEqual('Enhanced security posture');
    
    expect(Array.isArray(service.process_steps)).toBe(true);
    expect(service.process_steps).toHaveLength(5);
    expect(service.process_steps[0]).toEqual('Initial assessment and gap analysis');
  });

  it('should handle services with null pricing_info', async () => {
    await db.insert(servicesTable)
      .values({
        slug: testService2.slug,
        name: testService2.name,
        title: testService2.title,
        description: testService2.description,
        benefits: testService2.benefits,
        process_steps: testService2.process_steps,
        timeline: testService2.timeline,
        pricing_info: null
      })
      .execute();

    const result = await getServices();
    
    expect(result).toHaveLength(1);
    expect(result[0].pricing_info).toBeNull();
  });
});