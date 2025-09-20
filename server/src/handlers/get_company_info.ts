import { db } from '../db';
import { companyInfoTable } from '../db/schema';
import { type CompanyInfo } from '../schema';

export const getCompanyInfo = async (): Promise<CompanyInfo | null> => {
  try {
    // Get the first (and should be only) company info record
    const results = await db.select()
      .from(companyInfoTable)
      .limit(1)
      .execute();

    if (results.length === 0) {
      return null;
    }

    const companyInfo = results[0];
    return {
      ...companyInfo,
      // All fields are already in the correct format from the database
      // JSON fields (values) are automatically parsed by Drizzle
      // Dates are automatically converted to Date objects
      // No numeric conversions needed as founded_year is an integer column
    };
  } catch (error) {
    console.error('Failed to fetch company info:', error);
    throw error;
  }
};