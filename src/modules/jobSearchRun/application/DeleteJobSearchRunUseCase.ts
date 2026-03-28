import type { JobSearchRunRepository } from '@jobSearchRun/domain/JobSearchRunRepository.ts'

export class DeleteJobSearchRunUseCase {
  constructor (private readonly repo: JobSearchRunRepository) {}

  async execute (id: string): Promise<void> {
    return this.repo.delete(id)
  }
}
