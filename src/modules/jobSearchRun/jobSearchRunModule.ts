import type { AppModule } from '../moduleContract.ts'
import { JobSearchRunRepositoryMongo } from './infrastructure/repositories/JobSearchRunRepositoryMongo.ts'
import { jobSearchRunRoutes } from './infrastructure/http/jobSearchRunRoutes.ts'
import { processCVRoutes } from './infrastructure/http/processCVRoutes.ts'
import { AIEvaluationClient } from './infrastructure/external-services/OpenRouter.ts'
import {
  ListJobSearchRunsByUserIdUseCase,
  GetJobSearchRunByIdUseCase,
  CreateJobSearchRunUseCase,
  UpdateJobSearchRunUseCase,
  DeleteJobSearchRunUseCase,
  ProcessCVAndSearchJobsUseCase
} from '@jobSearchRun/application'
import { HimalayasClient } from './infrastructure/external-services/HimalayasJobs.ts'

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

      const aIEvaluationClient = new AIEvaluationClient()
      const himalayasClient = new HimalayasClient()
      const processCVAndSearchJobsUseCase = new ProcessCVAndSearchJobsUseCase(aIEvaluationClient, himalayasClient, repo)

      app.register(
        processCVRoutes({
          processCVAndSearchJobsUseCase
        })
      )
    },
  }
}
