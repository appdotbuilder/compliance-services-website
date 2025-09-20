import { db } from '../db';
import { companyInfoTable } from '../db/schema';
import { type UpdateCompanyInfoInput, type CompanyInfo } from '../schema';
import { eq } from 'drizzle-orm';

export const updateCompanyInfo = async (input: UpdateCompanyInfoInput): Promise<CompanyInfo> => {
  try {
    // First, check if company info record exists
    const existingCompanyInfo = await db.select()
      .from(companyInfoTable)
      .limit(1)
      .execute();

    if (existingCompanyInfo.length === 0) {
      throw new Error('Company information record not found. Please create company info first.');
    }

    const companyId = existingCompanyInfo[0].id;

    // Build update object with only provided fields
    const updateData: any = {
      updated_at: new Date()
    };

    if (input.mission !== undefined) {
      updateData.mission = input.mission;
    }
    if (input.values !== undefined) {
      updateData.values = input.values;
    }
    if (input.team_description !== undefined) {
      updateData.team_description = input.team_description;
    }
    if (input.founded_year !== undefined) {
      updateData.founded_year = input.founded_year;
    }
    if (input.contact_email !== undefined) {
      updateData.contact_email = input.contact_email;
    }
    if (input.contact_phone !== undefined) {
      updateData.contact_phone = input.contact_phone;
    }
    if (input.address !== undefined) {
      updateData.address = input.address;
    }

    // Update the company info record
    const result = await db.update(companyInfoTable)
      .set(updateData)
      .where(eq(companyInfoTable.id, companyId))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Company info update failed:', error);
    throw error;
  }
};