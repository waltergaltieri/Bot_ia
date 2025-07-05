import Company, { ICompany } from '../models/Company';
import { logger } from '../utils/logger';

export class CompanyService {
  static async findById(id: string): Promise<ICompany | null> {
    try {
      const company = await Company.findById(id);
      return company;
    } catch (error) {
      logger.error('Error finding company by ID:', error);
      throw error;
    }
  }

  static async create(companyData: Partial<ICompany>): Promise<ICompany> {
    try {
      const company = new Company(companyData);
      await company.save();
      return company;
    } catch (error) {
      logger.error('Error creating company:', error);
      throw error;
    }
  }

  static async update(id: string, companyData: Partial<ICompany>): Promise<ICompany | null> {
    try {
      const company = await Company.findByIdAndUpdate(id, companyData, { new: true });
      return company;
    } catch (error) {
      logger.error('Error updating company:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await Company.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Error deleting company:', error);
      throw error;
    }
  }
}

export default CompanyService;
