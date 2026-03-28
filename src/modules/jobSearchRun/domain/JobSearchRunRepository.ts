import type { JobSearchRun, JobMatch, MissingSkill } from './JobSearchRun'

export interface JobSearchRunRepository {
  listByUserId(userId: string): Promise<JobSearchRun[]>;
  update(id: string, jobSearchRun: JobSearchRun): Promise<JobSearchRun>;
  create(input: {
    userId: string;
    fullName: string;
    role: string;
    experience: string;
    education: string;
    jobs: JobMatch[];
    topMissingSkills: MissingSkill[];
    createdAt: string;
  }): Promise<JobSearchRun>;
  delete(id: string): Promise<void>;
}
