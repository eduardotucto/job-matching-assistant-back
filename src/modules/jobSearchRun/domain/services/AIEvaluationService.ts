export interface AIEvaluationResult {
  role: string
  skills: string[]
  yearsOfExperience: number
  seniorityLevel: 'junior' | 'mid' | 'senior'
  topSkills: string[]
  summary: string
}

export interface AIEvaluationService {
  evaluateCv(cvText: string): Promise<AIEvaluationResult>;
}
