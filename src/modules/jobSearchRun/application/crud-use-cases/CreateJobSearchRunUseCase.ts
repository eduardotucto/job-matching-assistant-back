import type { JobSearchRun, JobMatch, MissingSkill } from '@jobSearchRun/domain/JobSearchRun.ts'
import type { JobSearchRunRepository } from '@jobSearchRun/domain/JobSearchRunRepository.ts'

export class CreateJobSearchRunUseCase {
  constructor (private readonly repo: JobSearchRunRepository) {}

  async execute (input: {
    userId: string;
    fullName: string;
    role: string;
    experience: string;
    education: string;
    jobs: JobMatch[];
    topMissingSkills: MissingSkill[];
  }): Promise<JobSearchRun> {
    return this.repo.create({
      ...input,
      createdAt: new Date().toISOString(),
    })
  }
}
