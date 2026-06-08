import type { MultipartFile } from '@fastify/multipart'
import type { JobSearchRunEntity } from '@jobSearchRun/domain'

export type AIEvaluationResult = Omit<JobSearchRunEntity, '_id' | 'userId' | 'fileName' | 'createdAt' | 'jobs' | 'topMissingSkills'>

export interface AIEvaluationService {
  evaluateCv(cvFile: MultipartFile): Promise<AIEvaluationResult | null>
}
