import type { User } from '@user/domain/User.ts'
import type { UserRepository } from '@user/domain/UserRepository.ts'

export class GetUserByIdUseCase {
  constructor (private readonly repo: UserRepository) {}

  async execute (id: string): Promise<User | null> {
    return this.repo.getById(id)
  }
}
