import { User } from "../../schemas";
import { Result } from "../../utils";

export interface IUserModel {
    isNewUser(phone: string): Promise<boolean>;
    saveOrUpdateUser(userData: { phone: string; [key: string]: any }): Promise<Result<any, string>>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByPhone(phone: string): Promise<User | null>;
    findByRole(role: string): Promise<User | null>;
    create(userData: Partial<User>): Promise<User>;
    update(id: string, userData: Partial<User>): Promise<User | null>;
    delete(id: string): Promise<void>;
}