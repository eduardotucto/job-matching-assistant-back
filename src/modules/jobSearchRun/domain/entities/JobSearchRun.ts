import { ObjectId } from 'mongodb'

export interface JobSearchRunEntity {
  _id: ObjectId | string
  userId: ObjectId | string
  fullName: string
  role: string
  experienceSummary: string
  yearsOfExperience: number
  education: CVEducation[]
  skills: string[]
  languages: CVLanguage[]
  summary: string
  metadata: CVMetadata
  jobs: JobMatch[]
  createdAt: Date
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

export interface JobMatch {
  jobId: string
  title: string
  source: string
  company: string
  location: string
  url: string
  requiredSkills: string[]
  match: {
    score: number
    matchedSkills: string[]
    missingSkills: string[]
  }
  application: {
    applied: boolean
    appliedAt: string | null
  }
  interviewPrep?: { // para cuando tenga mas créditos en loveable xd
    questions: string[]
    focusAreas: string[]
  }
}
