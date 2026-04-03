import type {
  JobSearchRunEntity,
  JobMatch,
  MissingSkill,
  JobSearchRunRepository
} from '@jobSearchRun/domain'

class CreateJobSearchRunUseCase {
  constructor (private readonly repo: JobSearchRunRepository) {}

  async execute (input: {
    userId: string;
    fullName: string;
    role: string;
    experience: string;
    education: string;
    jobs: JobMatch[];
    topMissingSkills: MissingSkill[];
  }): Promise<JobSearchRunEntity> {
    return this.repo.create({
      ...input,
      createdAt: new Date().toISOString(),
    })
  }
}

class DeleteJobSearchRunUseCase {
  constructor (private readonly repo: JobSearchRunRepository) {}

  async execute (id: string): Promise<void> {
    return this.repo.delete(id)
  }
}

class GetJobSearchRunByIdUseCase {
  constructor (private readonly repo: JobSearchRunRepository) {}

  async execute (id: string): Promise<JobSearchRunEntity | null> {
    if (!id) return null
    return this.repo.getById(id)
  }
}

class ListJobSearchRunsByUserIdUseCase {
  constructor (private readonly repo: JobSearchRunRepository) {}

  async execute (userId: string): Promise<JobSearchRunEntity[]> {
    return this.repo.listByUserId(userId)
  }
}

class UpdateJobSearchRunUseCase {
  constructor (private readonly repo: JobSearchRunRepository) {}

  async execute (id: string, jobSearchRun: JobSearchRunEntity): Promise<JobSearchRunEntity> {
    return this.repo.update(id, jobSearchRun)
  }
}

export {
  CreateJobSearchRunUseCase,
  DeleteJobSearchRunUseCase,
  GetJobSearchRunByIdUseCase,
  ListJobSearchRunsByUserIdUseCase,
  UpdateJobSearchRunUseCase
}
