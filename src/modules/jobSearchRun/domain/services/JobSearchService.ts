export interface JobSearchParameters {
  role: string
  seniority: string
  skills: string[]
}

export interface MatchedJob {
  guid: string
  title: string
  excerpt: string // summary of the job description
  source: string
  companyName: string
  minSalary: number | null
  maxSalary: number | null
  seniority: Seniority[]
  currency: Currency
  locationRestrictions: string | undefined
  description: string
  skills: string[]
  pubDate: number
  applicationLink: string
}

export enum Currency {
  USD = 'USD',
}
export enum Seniority {
  EntryLevel = 'Entry-level',
  MidLevel = 'Mid-level',
  Senior = 'Senior',
}

export interface JobSearchService {
  searchJobs(criteria: JobSearchParameters): Promise<MatchedJob[] | null>
}
