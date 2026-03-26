import type { User } from './User.ts'

export interface UserRepository {
  list(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
}
