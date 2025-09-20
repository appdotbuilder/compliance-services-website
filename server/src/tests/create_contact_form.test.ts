import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactFormsTable } from '../db/schema';
import { type CreateContactFormInput } from '../schema';
import { createContactForm } from '../handlers/create_contact_form';
import { eq } from 'drizzle-orm';

// Complete test input with all required fields
const testInput: CreateContactFormInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  company: 'Acme Corp',
  phone: '+1-555-0123',
  service: 'SOC2',
  message: 'We need help with SOC2 compliance for our startup. We are looking to get certified within the next 6 months.'
};

// Minimal test input with only required fields
const minimalInput: CreateContactFormInput = {
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  service: 'GDPR',
  message: 'Need assistance with GDPR compliance for our European operations.'
};

describe('createContactForm', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a contact form with all fields', async () => {
    const result = await createContactForm(testInput);

    // Basic field validation
    expect(result.name).toEqual('John Doe');
    expect(result.email).toEqual('john.doe@example.com');
    expect(result.company).toEqual('Acme Corp');
    expect(result.phone).toEqual('+1-555-0123');
    expect(result.service).toEqual('SOC2');
    expect(result.message).toEqual(testInput.message);
    expect(result.status).toEqual('new');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a contact form with minimal fields', async () => {
    const result = await createContactForm(minimalInput);

    // Basic field validation
    expect(result.name).toEqual('Jane Smith');
    expect(result.email).toEqual('jane.smith@example.com');
    expect(result.company).toBeNull();
    expect(result.phone).toBeNull();
    expect(result.service).toEqual('GDPR');
    expect(result.message).toEqual(minimalInput.message);
    expect(result.status).toEqual('new');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save contact form to database', async () => {
    const result = await createContactForm(testInput);

    // Query using proper drizzle syntax
    const contactForms = await db.select()
      .from(contactFormsTable)
      .where(eq(contactFormsTable.id, result.id))
      .execute();

    expect(contactForms).toHaveLength(1);
    expect(contactForms[0].name).toEqual('John Doe');
    expect(contactForms[0].email).toEqual('john.doe@example.com');
    expect(contactForms[0].company).toEqual('Acme Corp');
    expect(contactForms[0].phone).toEqual('+1-555-0123');
    expect(contactForms[0].service).toEqual('SOC2');
    expect(contactForms[0].message).toEqual(testInput.message);
    expect(contactForms[0].status).toEqual('new');
    expect(contactForms[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle all service types correctly', async () => {
    const serviceTypes = ['SOC2', 'ISO27001', 'GDPR', 'General'] as const;
    
    for (const service of serviceTypes) {
      const input = {
        ...testInput,
        email: `test-${service.toLowerCase()}@example.com`, // Unique email for each test
        service
      };
      
      const result = await createContactForm(input);
      expect(result.service).toEqual(service);
      
      // Verify in database
      const saved = await db.select()
        .from(contactFormsTable)
        .where(eq(contactFormsTable.id, result.id))
        .execute();
      
      expect(saved[0].service).toEqual(service);
    }
  });

  it('should handle null optional fields correctly', async () => {
    const inputWithNulls: CreateContactFormInput = {
      name: 'Test User',
      email: 'test@example.com',
      company: undefined, // Should become null
      phone: undefined, // Should become null
      service: 'General',
      message: 'This is a test message with at least ten characters.'
    };

    const result = await createContactForm(inputWithNulls);

    expect(result.company).toBeNull();
    expect(result.phone).toBeNull();

    // Verify in database
    const saved = await db.select()
      .from(contactFormsTable)
      .where(eq(contactFormsTable.id, result.id))
      .execute();

    expect(saved[0].company).toBeNull();
    expect(saved[0].phone).toBeNull();
  });

  it('should create multiple contact forms independently', async () => {
    const input1 = {
      ...testInput,
      email: 'user1@example.com',
      name: 'User One'
    };

    const input2 = {
      ...testInput,
      email: 'user2@example.com',
      name: 'User Two',
      service: 'ISO27001' as const
    };

    const result1 = await createContactForm(input1);
    const result2 = await createContactForm(input2);

    // Verify different IDs
    expect(result1.id).not.toEqual(result2.id);

    // Verify both exist in database
    const allForms = await db.select()
      .from(contactFormsTable)
      .execute();

    expect(allForms).toHaveLength(2);
    expect(allForms.find(f => f.id === result1.id)).toBeDefined();
    expect(allForms.find(f => f.id === result2.id)).toBeDefined();
  });
});