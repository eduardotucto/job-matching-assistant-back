export interface JobSearchCriteria {
  role: string
  skills: string[]
}

export interface matchedJob { // vamos a ver que devuelve el api
  id: string
  title: string
  company: string
  description: string
  skills: string[]
  salary?: number
  location: string
  url: string
}

export interface JobSearchService {
  searchJobs(criteria: JobSearchCriteria): Promise<matchedJob[]>
}
