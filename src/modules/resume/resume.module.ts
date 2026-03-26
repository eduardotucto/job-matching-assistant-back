import type { AppModule } from '../moduleContract.ts'
import { FakeResumeMongoRepository } from './infrastructure/mongodb/FakeResumeMongoRepository.ts'
import { ListResumesByUserIdUseCase } from './application/ListResumesByUserIdUseCase.ts'
import { GetResumeByIdUseCase } from './application/GetResumeByIdUseCase.ts'
import { CreateResumeUseCase } from './application/CreateResumeUseCase.ts'
import { resumeRoutes } from './infrastructure/http/resumeRoutes.ts'

export function buildResumeModule (): AppModule {
  return {
    name: 'resume',
    async register (app) {
      const repo = new FakeResumeMongoRepository()

      const listResumesByUserId = new ListResumesByUserIdUseCase(repo)
      const getResumeById = new GetResumeByIdUseCase(repo)
      const createResume = new CreateResumeUseCase(repo)

      app.register(
        resumeRoutes({
          listResumesByUserId,
          getResumeById,
          createResume,
        })
      )
    },
  }
}
