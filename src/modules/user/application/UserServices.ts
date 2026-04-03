import type {
  UserEntity,
  UserRepository
} from '@user/domain'

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
}

class CreateUserUseCase {
  constructor (private readonly repo: UserRepository) {}

  async execute (input: CreateUserInput): Promise<UserEntity> {
    return this.repo.create(input)
  }
}

class GetUserByEmailForAuthUseCase {
  constructor (private readonly repo: UserRepository) {}

  async execute (email: string): Promise<UserEntity | null> {
    return this.repo.getByEmailForAuth(email)
  }
}

class GetUserByIdUseCase {
  constructor (private readonly repo: UserRepository) {}

  async execute (id: string): Promise<UserEntity | null> {
    return this.repo.getById(id)
  }
}

class ListUsersUseCase {
  constructor (private readonly repo: UserRepository) {}

  async execute (): Promise<UserEntity[]> {
    return this.repo.list()
  }
}

export {
  CreateUserUseCase,
  GetUserByEmailForAuthUseCase,
  GetUserByIdUseCase,
  ListUsersUseCase
}
