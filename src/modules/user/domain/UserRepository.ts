import type { User, UserWithPassword } from './User.ts'

export interface UserRepository {
  list(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  getByEmailForAuth(email: string): Promise<UserWithPassword | null>;
  create(input: { name: string; email: string; password: string }): Promise<User>;
}
