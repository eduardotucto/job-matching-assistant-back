import type { Resume } from '@resume/domain/Resume.ts'
import type { ResumeRepository } from '@resume/domain/ResumeRepository.ts'

export type CreateResumeInput = {
  user_id: string;
  file_url: string;
  parsed_json: unknown;
  created_at: string;
}

export class CreateResumeUseCase {
  constructor (private readonly repo: ResumeRepository) {}

  async execute (input: CreateResumeInput): Promise<Resume> {
    return this.repo.create(input)
  }
}
