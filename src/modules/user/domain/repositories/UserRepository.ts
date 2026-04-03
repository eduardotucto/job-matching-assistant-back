import type { UserEntity } from '@user/domain'

export interface UserRepository {
  list(): Promise<UserEntity[]>;
  getById(id: string): Promise<UserEntity | null>;
  getByEmailForAuth(email: string): Promise<UserEntity | null>;
  create(input: { name: string; email: string; password: string }): Promise<UserEntity>;
}
