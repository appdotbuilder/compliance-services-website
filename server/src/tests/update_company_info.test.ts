import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { companyInfoTable } from '../db/schema';
import { type UpdateCompanyInfoInput } from '../schema';
import { updateCompanyInfo } from '../handlers/update_company_info';
import { eq } from 'drizzle-orm';

// Test input for partial update
const testUpdateInput: UpdateCompanyInfoInput = {
  mission: 'Updated mission statement for testing',
  values: ['Updated value 1', 'Updated value 2', 'Updated value 3'],
  contact_email: 'updated@example.com'
};

// Complete test input with all fields
const completeUpdateInput: UpdateCompanyInfoInput = {
  mission: 'Complete updated mission statement',
  values: ['Complete value 1', 'Complete value 2'],
  team_description: 'Updated team description for comprehensive testing',
  founded_year: 2021,
  contact_email: 'complete@example.com',
  contact_phone: '+1 (555) 987-6543',
  address: '456 Updated Street, New City, NC 54321'
};

describe('updateCompanyInfo', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  // Helper function to create initial company info record
  const createInitialCompanyInfo = async () => {
    const result = await db.insert(companyInfoTable)
      .values({
        mission: 'Original mission statement',
        values: ['Original value 1', 'Original value 2'],
        team_description: 'Original team description',
        founded_year: 2020,
        contact_email: 'original@example.com',
        contact_phone: '+1 (555) 123-4567',
        address: 'Original Address'
      })
      .returning()
      .execute();
    
    return result[0];
  };

  it('should update company info with partial data', async () => {
    // Create initial record
    const initial = await createInitialCompanyInfo();

    // Update with partial data
    const result = await updateCompanyInfo(testUpdateInput);

    // Verify updated fields
    expect(result.mission).toEqual('Updated mission statement for testing');
    expect(result.values).toEqual(['Updated value 1', 'Updated value 2', 'Updated value 3']);
    expect(result.contact_email).toEqual('updated@example.com');

    // Verify unchanged fields remain the same
    expect(result.team_description).toEqual('Original team description');
    expect(result.founded_year).toEqual(2020);
    expect(result.contact_phone).toEqual('+1 (555) 123-4567');
    expect(result.address).toEqual('Original Address');

    // Verify metadata
    expect(result.id).toEqual(initial.id);
    expect(result.created_at).toEqual(initial.created_at);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > initial.updated_at).toBe(true);
  });

  it('should update company info with all fields', async () => {
    // Create initial record
    const initial = await createInitialCompanyInfo();

    // Update with complete data
    const result = await updateCompanyInfo(completeUpdateInput);

    // Verify all fields are updated
    expect(result.mission).toEqual('Complete updated mission statement');
    expect(result.values).toEqual(['Complete value 1', 'Complete value 2']);
    expect(result.team_description).toEqual('Updated team description for comprehensive testing');
    expect(result.founded_year).toEqual(2021);
    expect(result.contact_email).toEqual('complete@example.com');
    expect(result.contact_phone).toEqual('+1 (555) 987-6543');
    expect(result.address).toEqual('456 Updated Street, New City, NC 54321');

    // Verify metadata
    expect(result.id).toEqual(initial.id);
    expect(result.created_at).toEqual(initial.created_at);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > initial.updated_at).toBe(true);
  });

  it('should save updates to database', async () => {
    // Create initial record
    await createInitialCompanyInfo();

    // Update company info
    const result = await updateCompanyInfo(testUpdateInput);

    // Query database directly to verify persistence
    const dbRecord = await db.select()
      .from(companyInfoTable)
      .where(eq(companyInfoTable.id, result.id))
      .execute();

    expect(dbRecord).toHaveLength(1);
    expect(dbRecord[0].mission).toEqual('Updated mission statement for testing');
    expect(dbRecord[0].values).toEqual(['Updated value 1', 'Updated value 2', 'Updated value 3']);
    expect(dbRecord[0].contact_email).toEqual('updated@example.com');
    expect(dbRecord[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle nullable fields correctly', async () => {
    // Create initial record with nullable fields
    await createInitialCompanyInfo();

    // Update with null values
    const nullUpdateInput: UpdateCompanyInfoInput = {
      contact_phone: null,
      address: null
    };

    const result = await updateCompanyInfo(nullUpdateInput);

    // Verify nullable fields are set to null
    expect(result.contact_phone).toBeNull();
    expect(result.address).toBeNull();

    // Verify other fields remain unchanged
    expect(result.mission).toEqual('Original mission statement');
    expect(result.contact_email).toEqual('original@example.com');
  });

  it('should handle empty arrays correctly', async () => {
    // Create initial record
    await createInitialCompanyInfo();

    // Update with empty values array
    const emptyArrayInput: UpdateCompanyInfoInput = {
      values: []
    };

    const result = await updateCompanyInfo(emptyArrayInput);

    // Verify empty array is stored correctly
    expect(result.values).toEqual([]);
    expect(Array.isArray(result.values)).toBe(true);
    expect(result.values.length).toEqual(0);
  });

  it('should throw error when company info record does not exist', async () => {
    // Try to update without creating initial record
    await expect(updateCompanyInfo(testUpdateInput))
      .rejects
      .toThrow(/Company information record not found/i);
  });

  it('should update only the first record when multiple exist', async () => {
    // Create multiple company info records (edge case)
    const first = await createInitialCompanyInfo();
    await db.insert(companyInfoTable)
      .values({
        mission: 'Second mission statement',
        values: ['Second value'],
        team_description: 'Second team description',
        founded_year: 2022,
        contact_email: 'second@example.com'
      })
      .execute();

    // Update should affect the first record
    const result = await updateCompanyInfo(testUpdateInput);

    // Verify the first record was updated
    expect(result.id).toEqual(first.id);
    expect(result.mission).toEqual('Updated mission statement for testing');

    // Verify database has both records but only first is updated
    const allRecords = await db.select()
      .from(companyInfoTable)
      .execute();
    
    expect(allRecords).toHaveLength(2);
    
    const firstRecord = allRecords.find(r => r.id === first.id);
    const secondRecord = allRecords.find(r => r.id !== first.id);
    
    expect(firstRecord?.mission).toEqual('Updated mission statement for testing');
    expect(secondRecord?.mission).toEqual('Second mission statement');
  });
});