import User, { IUser } from '../models/User';
import { logger } from '../utils/logger';

export class UserService {
  static async findByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      return user;
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<IUser | null> {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw error;
    }
  }

  static async findByRole(role: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ role });
      return user;
    } catch (error) {
      logger.error('Error finding user by role:', error);
      throw error;
    }
  }

  static async create(userData: Partial<IUser>): Promise<IUser> {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  static async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    try {
      const user = await User.findByIdAndUpdate(id, userData, { new: true });
      return user;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await User.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }
}

export default UserService;
