import type { JobSearchRun } from '@jobSearchRun/domain/JobSearchRun.ts'
import type { JobSearchRunRepository } from '@jobSearchRun/domain/JobSearchRunRepository.ts'

export class GetJobSearchRunByIdUseCase {
  constructor (private readonly repo: JobSearchRunRepository) {}

  async execute (id: string): Promise<JobSearchRun | null> {
    if (!id) return null
    return (this.repo as any).getById(id)
  }
}
