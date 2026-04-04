import type {
  AIEvaluationService,
  JobSearchRunEntity,
  JobSearchRunRepository,
  // JobSearchService
} from '@jobSearchRun/domain'
import type { ProcessCVDto } from './ProcessCVAndSearchJobsDto'

export class ProcessCVAndSearchJobsUseCase {
  constructor (
    private aiEvaluationService: AIEvaluationService,
    // private jobSearchService: JobSearchService,
    private jobSearchRunRepository: JobSearchRunRepository
  ) {}

  async execute (request: ProcessCVDto): Promise<JobSearchRunEntity | null> {
    const { cvText, userId } = request

    console.log(JSON.stringify({
      userId,
      cvText
    }))
    const evaluation = await this.aiEvaluationService.evaluateCv(cvText)

    console.log('Evaluation:', evaluation)

    // const jobs = await this.jobSearchService.searchJobs({
    //   role: evaluation.role,
    //   skills: evaluation.skills
    // })

    // const jobSearchRun = {
    //   userId,
    //   cvEvaluation: evaluation,
    //   jobsFound: jobs,
    //   createdAt: new Date(),
    // }

    // await this.jobSearchRunRepository.create(jobSearchRun)

    return null
  }
}
