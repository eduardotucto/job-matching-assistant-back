import type { User } from '../domain/User.ts'
import type { UserRepository } from '../domain/UserRepository.ts'

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
}

export class CreateUserUseCase {
  constructor (private readonly repo: UserRepository) {}

  async execute (input: CreateUserInput): Promise<User> {
    return this.repo.create(input)
  }
}
