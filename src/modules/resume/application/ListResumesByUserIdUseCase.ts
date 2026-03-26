import type { Resume } from '../domain/Resume.ts'
import type { ResumeRepository } from '../domain/ResumeRepository.ts'

export class ListResumesByUserIdUseCase {
  constructor (private readonly repo: ResumeRepository) {}

  async execute (userId: string): Promise<Resume[]> {
    return this.repo.listByUserId(userId)
  }
}
