import type { JobSearchRun } from '@jobSearchRun/domain/JobSearchRun.ts'
import type { JobSearchRunRepository } from '@jobSearchRun/domain/JobSearchRunRepository.ts'

export class UpdateJobSearchRunUseCase {
  constructor (private readonly repo: JobSearchRunRepository) {}

  async execute (id: string, jobSearchRun: JobSearchRun): Promise<JobSearchRun> {
    return this.repo.update(id, jobSearchRun)
  }
}
