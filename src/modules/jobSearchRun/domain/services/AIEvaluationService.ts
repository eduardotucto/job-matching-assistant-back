import type { Multipart } from '@fastify/multipart'

export interface AIEvaluationResult {
  fullName: string
  role: string
  experienceSummary: string
  yearsOfExperience: number
  education: CVEducation[]
  skills: string[]
  languages: CVLanguage[]
  summary: string
  metadata: CVMetadata
}

export interface CVEducation {
  degree: string
  institution: string
  year?: string
}

export interface CVLanguage {
  name: string
  level: string
}

export interface CVMetadata {
  seniorityLevel: 'junior' | 'mid' | 'senior'
  inferredRoleConfidence: 'low' | 'medium' | 'high' // Indicates how confidently the role was inferred from the CV
  hasClearExperienceDates: boolean // Indicates whether the CV contains clear and consistent experience dates
}

export interface AIEvaluationService {
  evaluateCv(cvFile: Multipart): Promise<AIEvaluationResult | null>;
}
