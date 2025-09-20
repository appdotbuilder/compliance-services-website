import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { companyInfoTable } from '../db/schema';
import { getCompanyInfo } from '../handlers/get_company_info';

describe('getCompanyInfo', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return null when no company info exists', async () => {
    const result = await getCompanyInfo();
    expect(result).toBeNull();
  });

  it('should return company info when it exists', async () => {
    // Insert test company info
    const testCompanyInfo = {
      mission: 'To provide excellent compliance services to businesses worldwide',
      values: ['Integrity', 'Excellence', 'Innovation'],
      team_description: 'Our team consists of experienced professionals with deep expertise in compliance and security frameworks',
      founded_year: 2020,
      contact_email: 'contact@example.com',
      contact_phone: '+1 (555) 123-4567',
      address: '123 Main St, Business City, BC 12345'
    };

    await db.insert(companyInfoTable)
      .values(testCompanyInfo)
      .execute();

    const result = await getCompanyInfo();

    // Verify all fields are correctly returned
    expect(result).not.toBeNull();
    expect(result!.mission).toEqual(testCompanyInfo.mission);
    expect(result!.values).toEqual(testCompanyInfo.values);
    expect(result!.team_description).toEqual(testCompanyInfo.team_description);
    expect(result!.founded_year).toEqual(testCompanyInfo.founded_year);
    expect(result!.contact_email).toEqual(testCompanyInfo.contact_email);
    expect(result!.contact_phone).toEqual(testCompanyInfo.contact_phone);
    expect(result!.address).toEqual(testCompanyInfo.address);

    // Verify auto-generated fields
    expect(result!.id).toBeDefined();
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);

    // Verify JSON array fields are properly parsed
    expect(Array.isArray(result!.values)).toBe(true);
    expect(result!.values.length).toEqual(3);
  });

  it('should return first record when multiple company info records exist', async () => {
    // Insert first company info
    const firstCompanyInfo = {
      mission: 'First company mission',
      values: ['Value1', 'Value2'],
      team_description: 'First team description',
      founded_year: 2019,
      contact_email: 'first@example.com',
      contact_phone: '+1 (555) 111-1111',
      address: '111 First St'
    };

    // Insert second company info
    const secondCompanyInfo = {
      mission: 'Second company mission',
      values: ['Value3', 'Value4'],
      team_description: 'Second team description',
      founded_year: 2021,
      contact_email: 'second@example.com',
      contact_phone: '+1 (555) 222-2222',
      address: '222 Second St'
    };

    // Insert both records
    await db.insert(companyInfoTable)
      .values(firstCompanyInfo)
      .execute();

    await db.insert(companyInfoTable)
      .values(secondCompanyInfo)
      .execute();

    const result = await getCompanyInfo();

    // Should return the first record (lowest ID)
    expect(result).not.toBeNull();
    expect(result!.mission).toEqual(firstCompanyInfo.mission);
    expect(result!.contact_email).toEqual(firstCompanyInfo.contact_email);
  });

  it('should handle nullable fields correctly', async () => {
    // Insert company info with nullable fields set to null
    const testCompanyInfo = {
      mission: 'Test mission',
      values: ['Test value'],
      team_description: 'Test team description',
      founded_year: 2020,
      contact_email: 'test@example.com',
      contact_phone: null,
      address: null
    };

    await db.insert(companyInfoTable)
      .values(testCompanyInfo)
      .execute();

    const result = await getCompanyInfo();

    expect(result).not.toBeNull();
    expect(result!.contact_phone).toBeNull();
    expect(result!.address).toBeNull();

    // Verify non-nullable fields are still present
    expect(result!.mission).toEqual(testCompanyInfo.mission);
    expect(result!.contact_email).toEqual(testCompanyInfo.contact_email);
  });

  it('should verify database query is executed correctly', async () => {
    // Insert test data
    await db.insert(companyInfoTable)
      .values({
        mission: 'Query test mission',
        values: ['Test', 'Query'],
        team_description: 'Query test description',
        founded_year: 2022,
        contact_email: 'query@test.com',
        contact_phone: '+1 (555) 999-9999',
        address: '999 Query St'
      })
      .execute();

    const result = await getCompanyInfo();

    // Verify the record was actually fetched from database
    const directQuery = await db.select()
      .from(companyInfoTable)
      .limit(1)
      .execute();

    expect(result).not.toBeNull();
    expect(directQuery.length).toEqual(1);
    expect(result!.id).toEqual(directQuery[0].id);
    expect(result!.mission).toEqual(directQuery[0].mission);
  });
});