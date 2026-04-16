import type { Multipart } from '@fastify/multipart'
import type { JobSearchRunEntity } from '@jobSearchRun/domain'

export type AIEvaluationResult = Omit<JobSearchRunEntity, '_id' | 'userId' | 'createdAt' | 'jobs' | 'topMissingSkills'>

export interface AIEvaluationService {
  evaluateCv(cvFile: Multipart): Promise<AIEvaluationResult | null>
}
