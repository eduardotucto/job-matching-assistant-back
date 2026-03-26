import type { AppModule } from '../moduleContract.ts'
import { FakeUserMongoRepository } from './infrastructure/mongodb/FakeUserMongoRepository.ts'
import { ListUsersUseCase } from '@user/application/ListUsersUseCase.ts'
import { GetUserByIdUseCase } from '@user/application/GetUserByIdUseCase.ts'
import { userRoutes } from './infrastructure/http/userRoutes.ts'

export function buildUserModule (): AppModule {
  return {
    name: 'user',
    async register (app) {
      const repo = new FakeUserMongoRepository()

      const listUsers = new ListUsersUseCase(repo)
      const getUserById = new GetUserByIdUseCase(repo)

      app.register(userRoutes({ listUsers, getUserById }))
    },
  }
}
