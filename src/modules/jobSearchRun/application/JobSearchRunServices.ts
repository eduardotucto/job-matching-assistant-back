import type {
  JobSearchRunEntity,
  JobSearchRunRepository
} from '@jobSearchRun/domain'

class CreateJobSearchRunUseCase {
  constructor (private readonly repo: JobSearchRunRepository) {}

  async execute (input: Omit<JobSearchRunEntity, '_id'>): Promise<JobSearchRunEntity> {
    return this.repo.create({
      ...input,
      createdAt: new Date()
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
