import type { AppModule } from '../moduleContract.ts'
import {
  CreateUserUseCase,
  GetUserByIdUseCase,
  GetUserByEmailForAuthUseCase
} from '@user/application/UserServices.ts'
import { userRoutes } from './infrastructure/http/userRoutes.ts'
import { UserRepositoryMongo } from './infrastructure/repositories/UserRepositoryMongo.ts'

export type UserAuthServices = {
  createUser: CreateUserUseCase;
  getUserByEmailForAuth: GetUserByEmailForAuthUseCase;
}

export function buildUserModuleAndServices (): { module: AppModule; authServices: UserAuthServices } {
  const repo = new UserRepositoryMongo()
  const getUserById = new GetUserByIdUseCase(repo)
  const createUser = new CreateUserUseCase(repo)
  const getUserByEmailForAuth = new GetUserByEmailForAuthUseCase(repo)

  return {
    authServices: { createUser, getUserByEmailForAuth },
    module: {
      name: 'user',
      async register (app) {
        app.register(userRoutes({ getUserById }))
      }
    }
  }
}
