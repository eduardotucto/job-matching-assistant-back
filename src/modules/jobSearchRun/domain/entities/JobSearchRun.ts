import { ObjectId } from 'mongodb'

export interface JobSearchRunEntity {
  _id: ObjectId | string
  userId: string
  fullName: string
  role: string
  experience: string
  education: string
  jobs: JobMatch[]
  topMissingSkills: MissingSkill[]
  createdAt: string
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

export interface MissingSkill { // para cuando tenga mas créditos en loveable xd
  skill: string
  count: number
}
