import { IUserModel } from "../..";
import { UserScheme } from "../../../config/db";
import { User } from "../../../schemas";
import { Result } from "../../../utils";

import { logger } from "../../../utils/logger";

export class UserModel implements IUserModel {
  private readonly userScheme = UserScheme;

  async isNewUser(phone: string): Promise<boolean> {
    const user = await this.userScheme.findOne({ phone });
    return !user;
  }

  async saveOrUpdateUser(userData: { phone: string; [key: string]: any }): Promise<Result<any, string>> {
    try {
      const updatedUser = await this.userScheme.findOneAndUpdate({ phone: userData.phone }, { $set: userData }, { new: true, upsert: true });
      return { success: true, data: updatedUser };
    } catch (error: any) {
      const errorMsg = `Failed to save or update user with phone ${userData.phone}: ${error?.message ?? String(error)}`;
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  async findByEmail(email: string): Promise<any | null> {
    try {
      const user = await this.userScheme.findOne({ email: email.toLowerCase() });
      return user;
    } catch (error) {
      logger.error("Error finding user by email:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<any | null> {
    try {
      const user = await this.userScheme.findById(id);
      return user;
    } catch (error) {
      logger.error("Error finding user by ID:", error);
      throw error;
    }
  }

  async findByRole(role: string): Promise<any | null> {
    try {
      const user = await this.userScheme.findOne({ role });
      return user;
    } catch (error) {
      logger.error("Error finding user by role:", error);
      throw error;
    }
  }

  async create(userData: Partial<any>): Promise<any> {
    try {
      const user = new this.userScheme(userData);
      await user.save();
      return user;
    } catch (error) {
      logger.error("Error creating user:", error);
      throw error;
    }
  }

  async update(id: string, userData: Partial<any>): Promise<any | null> {
    try {
      const user = await this.userScheme.findByIdAndUpdate(id, userData, { new: true });
      return user;
    } catch (error) {
      logger.error("Error updating user:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.userScheme.findByIdAndDelete(id);
    } catch (error) {
      logger.error("Error deleting user:", error);
      throw error;
    }
  }

  async findByPhone(phone: string): Promise<User | null> {
    try {
      const user = await this.userScheme.findOne({ phone });
      return user;
    } catch (error) {
      logger.error("Error finding user by phone:", error);
      throw error;
    }
  }
}
