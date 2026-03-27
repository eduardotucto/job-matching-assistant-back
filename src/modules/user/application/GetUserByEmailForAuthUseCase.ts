import type { UserWithPassword } from '../domain/User.ts'
import type { UserRepository } from '../domain/UserRepository.ts'

export class GetUserByEmailForAuthUseCase {
  constructor (private readonly repo: UserRepository) {}

  async execute (email: string): Promise<UserWithPassword | null> {
    return this.repo.getByEmailForAuth(email)
  }
}
