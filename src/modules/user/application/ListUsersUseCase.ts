import type { User } from '@user/domain/User.ts'
import type { UserRepository } from '@user/domain/UserRepository.ts'

export class ListUsersUseCase {
  constructor (private readonly repo: UserRepository) {}

  async execute (): Promise<User[]> {
    return this.repo.list()
  }
}
