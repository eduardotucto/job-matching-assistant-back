import axios from 'axios'
import type { JobSearchParameters, JobSearchService, MatchedJob } from '@jobSearchRun/domain'

interface HimalayasApiResponse {
  offset: number
  limit: number
  totalCount: number
  jobs: MatchedJob[]
}

export class HimalayasClient implements JobSearchService {
  async searchJobs (params: JobSearchParameters): Promise<MatchedJob[] | null> {
    const response = await axios.get('https://himalayas.app/jobs/api/search', {
      params: {
        q: params.role,
        seniority: params.seniority,
        sort: 'salaryDesc'
      }
    })

    const data: HimalayasApiResponse = response.data

    return data.jobs.map((job: MatchedJob) => ({
      title: job.title,
      excerpt: job.excerpt,
      companyName: job.companyName,
      // companySlug: job.companySlug,
      // companyLogo: job.companyLogo,
      // employmentType: job.employmentType,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      seniority: job.seniority,
      currency: job.currency,
      locationRestrictions: job.locationRestrictions,
      // timezoneRestrictions: job.timezoneRestrictions,
      // categories: job.categories,
      // parentCategories: job.parentCategories,
      description: job.description,
      pubDate: job.pubDate,
      // expiryDate: job.expiryDate,
      applicationLink: job.applicationLink,
      guid: job.guid,
    }))
  }
}
