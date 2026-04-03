import type {
  JobSearchRunEntity,
  JobMatch,
  MissingSkill
} from '@jobSearchRun/domain'

export interface JobSearchRunRepository {
  listByUserId(userId: string): Promise<JobSearchRunEntity[]>
  update(id: string, jobSearchRun: JobSearchRunEntity): Promise<JobSearchRunEntity>
  create(input: {
    userId: string
    fullName: string
    role: string
    experience: string
    education: string
    jobs: JobMatch[]
    topMissingSkills: MissingSkill[]
    createdAt: string
  }): Promise<JobSearchRunEntity>
  delete(id: string): Promise<void>
  getById(id: string): Promise<JobSearchRunEntity | null>
}
