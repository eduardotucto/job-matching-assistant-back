import type { Resume } from '../domain/Resume.ts'
import type { ResumeRepository } from '../domain/ResumeRepository.ts'

export class GetResumeByIdUseCase {
  constructor (private readonly repo: ResumeRepository) {}

  async execute (id: string): Promise<Resume | null> {
    return this.repo.getById(id)
  }
}
