import type { Multipart } from '@fastify/multipart'
import type { JobSearchRunEntity } from '@jobSearchRun/domain'

export type AIEvaluationResult = Omit<JobSearchRunEntity, '_id' | 'userId' | 'createdAt'>
export type AIRequiredSkillsPerJobResult = {
  id: string
  requiredSkills: string[]
}

export interface AIEvaluationService {
  evaluateCv(cvFile: Multipart): Promise<AIEvaluationResult | null>
  getRequiredSkillsForJobs(jobDescriptions: { id: string; description: string }[]): Promise<AIRequiredSkillsPerJobResult[] | null>
}
