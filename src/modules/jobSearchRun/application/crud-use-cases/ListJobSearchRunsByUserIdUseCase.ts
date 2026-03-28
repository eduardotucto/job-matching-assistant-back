import type { JobSearchRun } from '@jobSearchRun/domain/JobSearchRun.ts'
import type { JobSearchRunRepository } from '@jobSearchRun/domain/JobSearchRunRepository.ts'

export class ListJobSearchRunsByUserIdUseCase {
  constructor (private readonly repo: JobSearchRunRepository) {}

  async execute (userId: string): Promise<JobSearchRun[]> {
    return this.repo.listByUserId(userId)
  }
}
