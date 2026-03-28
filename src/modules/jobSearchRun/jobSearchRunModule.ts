import type { AppModule } from '../moduleContract.ts'
import { JobSearchRunRepositoryMongo } from './infrastructure/repositories/JobSearchRunRepositoryMongo.ts'
import { ListJobSearchRunsByUserIdUseCase } from './application/ListJobSearchRunsByUserIdUseCase.ts'
import { GetJobSearchRunByIdUseCase } from './application/GetJobSearchRunByIdUseCase.ts'
import { CreateJobSearchRunUseCase } from './application/CreateJobSearchRunUseCase.ts'
import { UpdateJobSearchRunUseCase } from './application/UpdateJobSearchRunUseCase.ts'
import { DeleteJobSearchRunUseCase } from './application/DeleteJobSearchRunUseCase.ts'
import { jobSearchRunRoutes } from './infrastructure/http/jobSearchRunRoutes.ts'

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
