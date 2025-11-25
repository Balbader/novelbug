import * as model from '../models/user.model';
import { type usersTable } from '@/drizzle/schemas/users';

export const usersService = {
    async createUser(user: typeof usersTable.$inferInsert) {
        if (!user) {
            throw new Error('User not provided');
        }
        if (!user.id) {
            throw new Error('User ID not provided');
        }
        const data = {
            kinde_id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            date_of_birth: user.date_of_birth,
            country: user.country,
            created_at: new Date(),
        };
        const newUser = await model.usersModel.create(data);
        if (!newUser) {
            throw new Error('User not returned by model');
        }
        return newUser;

    },
    async update(userId: string, userData: Partial<typeof usersTable.$inferInsert>) {
        const user = await model.usersModel.update(userId, userData);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
    async getAll() {
        const users = await model.usersModel.getAll();
        if (!users) {
            return [];
        }
        return users;
    },
    async getByKindeId(kindeId: string) {
        const user = await model.usersModel.getByKindeId(kindeId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
    async getByUsername(username: string) {
        const user = await model.usersModel.getByUsername(username);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
    async getByEmail(email: string) {
        const user = await model.usersModel.getByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
    async getById(id: string) {
        const user = await model.usersModel.getById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
};
