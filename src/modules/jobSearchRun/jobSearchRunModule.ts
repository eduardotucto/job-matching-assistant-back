import type { AppModule } from '../moduleContract.ts'
import { JobSearchRunRepositoryMongo } from './infrastructure/repositories/JobSearchRunRepositoryMongo.ts'
import { jobSearchRunRoutes } from './infrastructure/http/jobSearchRunRoutes.ts'
import {
  ListJobSearchRunsByUserIdUseCase,
  GetJobSearchRunByIdUseCase,
  CreateJobSearchRunUseCase,
  UpdateJobSearchRunUseCase,
  DeleteJobSearchRunUseCase
} from '@jobSearchRun/application'

export function buildJobSearchRunModule (): AppModule {
  return {
    name: 'jobSearchRun',
    async register (app) {
      const repo = new JobSearchRunRepositoryMongo()

      const listJobSearchRunsByUserId = new ListJobSearchRunsByUserIdUseCase(repo)
      const getJobSearchRunById = new GetJobSearchRunByIdUseCase(repo)
      const createJobSearchRun = new CreateJobSearchRunUseCase(repo)
      const updateJobSearchRun = new UpdateJobSearchRunUseCase(repo)
      const deleteJobSearchRun = new DeleteJobSearchRunUseCase(repo)

      app.register(
        jobSearchRunRoutes({
          listJobSearchRunsByUserId,
          getJobSearchRunById,
          createJobSearchRun,
          updateJobSearchRun,
          deleteJobSearchRun,
        })
      )
    },
  }
}
