import type { AppModule } from '../moduleContract.ts'
import { FakeUserMongoRepository } from './infrastructure/mongodb/FakeUserMongoRepository.ts'
import { GetUserByIdUseCase } from '@user/application/GetUserByIdUseCase.ts'
import { userRoutes } from './infrastructure/http/userRoutes.ts'

export function buildUserModule (): AppModule {
  return {
    name: 'user',
    async register (app) {
      const repo = new FakeUserMongoRepository()

      const getUserById = new GetUserByIdUseCase(repo)

      app.register(userRoutes({ getUserById }))
    },
  }
}
