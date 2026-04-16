import type {
  JobSearchRunEntity,
} from '@jobSearchRun/domain'

export interface JobSearchRunRepository {
  listByUserId(userId: string): Promise<JobSearchRunEntity[]>
  update(id: string, jobSearchRun: JobSearchRunEntity): Promise<JobSearchRunEntity>
  create(input: Omit<JobSearchRunEntity, '_id'>): Promise<JobSearchRunEntity>
  delete(id: string): Promise<void>
  getById(id: string): Promise<JobSearchRunEntity | null>
}
