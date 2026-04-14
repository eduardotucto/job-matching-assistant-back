import type {
  AIEvaluationService,
  JobSearchRunEntity,
  JobSearchRunRepository,
  JobSearchService,
} from '@jobSearchRun/domain'
import type { ProcessCVDto } from './ProcessCVAndSearchJobsDto'

export const SKILL_ALIASES: Record<string, string> = {
  // Frontend
  react: 'React',
  reactjs: 'React',
  reactjsx: 'React',
  reactdotjs: 'React',
  reactnative: 'React Native',
  next: 'Next.js',
  nextjs: 'Next.js',
  nextdotjs: 'Next.js',
  vue: 'Vue',
  vuejs: 'Vue',
  vuedotjs: 'Vue',
  nuxt: 'Nuxt',
  nuxtjs: 'Nuxt',
  nuxtdotjs: 'Nuxt',
  angular: 'Angular',
  angularjs: 'AngularJS',
  svelte: 'Svelte',
  html: 'HTML',
  html5: 'HTML',
  css: 'CSS',
  css3: 'CSS',
  sass: 'Sass',
  scss: 'SCSS',
  less: 'Less',
  tailwind: 'Tailwind CSS',
  tailwindcss: 'Tailwind CSS',
  bootstrap: 'Bootstrap',
  materialui: 'Material UI',
  mui: 'Material UI',
  chakraui: 'Chakra UI',
  shadcn: 'shadcn/ui',
  shadcnui: 'shadcn/ui',
  redux: 'Redux',
  reduxjs: 'Redux',
  zustand: 'Zustand',
  recoil: 'Recoil',

  // JavaScript / TypeScript
  javascript: 'JavaScript',
  js: 'JavaScript',
  ecmascript: 'JavaScript',
  es6: 'ES6',
  es2015: 'ES6',
  typescript: 'TypeScript',
  ts: 'TypeScript',

  // Backend / Runtime
  node: 'Node.js',
  nodejs: 'Node.js',
  nodedotjs: 'Node.js',
  express: 'Express',
  expressjs: 'Express',
  nest: 'NestJS',
  nestjs: 'NestJS',
  fastify: 'Fastify',
  hono: 'Hono',
  deno: 'Deno',
  bun: 'Bun',

  // Languages
  java: 'Java',
  python: 'Python',
  go: 'Go',
  golang: 'Go',
  csharp: 'C#',
  dotnet: '.NET',
  aspnet: 'ASP.NET',
  aspnetcore: 'ASP.NET Core',
  php: 'PHP',
  ruby: 'Ruby',
  rails: 'Ruby on Rails',
  rubyonrails: 'Ruby on Rails',
  kotlin: 'Kotlin',
  swift: 'Swift',
  rust: 'Rust',
  c: 'C',
  cpp: 'C++',
  cplusplus: 'C++',

  // Databases
  mysql: 'MySQL',
  postgresql: 'PostgreSQL',
  postgres: 'PostgreSQL',
  mongodb: 'MongoDB',
  mongo: 'MongoDB',
  mariadb: 'MariaDB',
  sqlite: 'SQLite',
  redis: 'Redis',
  elasticsearch: 'Elasticsearch',
  opensearch: 'OpenSearch',
  dynamodb: 'DynamoDB',
  firestore: 'Firestore',

  // APIs / Architecture
  rest: 'REST APIs',
  restapi: 'REST APIs',
  restapis: 'REST APIs',
  graphql: 'GraphQL',
  grpc: 'gRPC',
  soap: 'SOAP',
  microservices: 'Microservices',
  eventdriven: 'Event-Driven Architecture',
  eventdrivenarchitecture: 'Event-Driven Architecture',
  serverless: 'Serverless',
  mvc: 'MVC',

  // Cloud / DevOps
  aws: 'AWS',
  amazonwebservices: 'AWS',
  azure: 'Azure',
  gcp: 'GCP',
  googlecloud: 'GCP',
  googlecloudplatform: 'GCP',
  docker: 'Docker',
  kubernetes: 'Kubernetes',
  k8s: 'Kubernetes',
  terraform: 'Terraform',
  cicd: 'CI/CD',
  githubactions: 'GitHub Actions',
  gitlabci: 'GitLab CI',
  jenkins: 'Jenkins',

  // Testing / Quality
  tdd: 'TDD',
  unittesting: 'Unit Testing',
  integrationtesting: 'Integration Testing',
  e2e: 'E2E Testing',
  e2etesting: 'E2E Testing',
  jest: 'Jest',
  vitest: 'Vitest',
  mocha: 'Mocha',
  chai: 'Chai',
  cypress: 'Cypress',
  playwright: 'Playwright',
  selenium: 'Selenium',

  // Tools
  git: 'Git',
  github: 'GitHub',
  gitlab: 'GitLab',
  bitbucket: 'Bitbucket',
  unix: 'Unix',
  unixshell: 'Unix Shell',
  shell: 'Shell',
  bash: 'Bash',
  linux: 'Linux',
  webpack: 'Webpack',
  vite: 'Vite',
  babel: 'Babel',
  npm: 'npm',
  yarn: 'Yarn',
  pnpm: 'pnpm',

  // Mobile / Misc
  android: 'Android',
  ios: 'iOS',
  reactquery: 'React Query',
  tanstackquery: 'TanStack Query',
  websocket: 'WebSockets',
  websockets: 'WebSockets'
}

export class ProcessCVAndSearchJobsUseCase {
  constructor (
    private aiEvaluationService: AIEvaluationService,
    private jobSearchService: JobSearchService,
    private jobSearchRunRepository: JobSearchRunRepository
  ) {}

  async execute (request: ProcessCVDto): Promise<JobSearchRunEntity | null> {
    const { cvFile } = request
    console.log('[ProcessCV] Starting CV processing', { userId: request.userId })

    // Step 1: Evaluate CV
    console.log('[ProcessCV] Step 1: Evaluating CV...')
    const evaluation = await this.aiEvaluationService.evaluateCv(cvFile)
    if (!evaluation) throw new Error('Failed to evaluate CV')
    console.log('[ProcessCV] Step 1 OK: CV evaluated', {
      role: evaluation.role,
      seniority: evaluation.metadata?.seniorityLevel,
      skillsCount: evaluation.skills?.length,
      skills: evaluation.skills
    })

    // Step 2: Search jobs
    console.log('[ProcessCV] Step 2: Searching jobs...', {
      role: evaluation.role,
      seniority: evaluation.metadata.seniorityLevel,
      skills: evaluation.skills
    })
    const jobs = await this.jobSearchService.searchJobs({
      role: evaluation.role,
      seniority: evaluation.metadata.seniorityLevel,
      skills: evaluation.skills
    })
    if (!jobs) throw new Error('Failed to search for jobs')
    console.log('[ProcessCV] Step 2 OK: Jobs found', {
      jobsCount: jobs.length,
      jobs: jobs.map(j => ({ guid: j.guid, title: j.title, company: j.companyName }))
    })

    // Step 3: Get required skills for each job
    const jobDescriptions = jobs.map(job => ({ id: job.guid, description: job.description }))
    console.log('[ProcessCV] Step 3: Getting required skills for jobs...', { jobsCount: jobDescriptions.length })
    const jobsWithRequiredSkills = await this.aiEvaluationService.getRequiredSkillsForJobs(jobDescriptions)
    if (!jobsWithRequiredSkills) throw new Error('Failed to get required skills for jobs')
    console.log('[ProcessCV] Step 3 OK: Required skills fetched', {
      jobsCount: jobsWithRequiredSkills.length,
      preview: jobsWithRequiredSkills.map(j => ({ id: j.id, requiredSkillsCount: j.requiredSkills?.length, requiredSkills: j.requiredSkills }))
    })

    // Step 4: Normalize and match skills
    console.log('[ProcessCV] Step 4: Normalizing and matching skills...')
    const jobsWithSkillsMatched = jobs.map(job => {
      const jobSkills = jobsWithRequiredSkills.find(j => j.id === job.guid)
      const normalized = jobSkills ? this.normalizeSkills(jobSkills.requiredSkills) : []
      console.log(`[ProcessCV]   Job "${job.title}" (${job.guid}):`, {
        rawSkillsCount: jobSkills?.requiredSkills?.length ?? 0,
        normalizedSkillsCount: normalized.length,
        normalizedSkills: normalized
      })
      return { ...job, requiredSkills: normalized }
    })

    const evaluationWithNormalizedSkills = {
      ...evaluation,
      skills: this.normalizeSkills(evaluation.skills)
    }
    console.log('[ProcessCV] Step 4 OK: Normalized CV skills', {
      original: evaluation.skills,
      normalized: evaluationWithNormalizedSkills.skills
    })

    // Step 5: Build job search run with match scores
    console.log('[ProcessCV] Step 5: Building job search run entity...')
    const mappedJobs = jobsWithSkillsMatched.map(job => {
      const matchedSkills = job.requiredSkills.filter(skill => evaluationWithNormalizedSkills.skills.includes(skill))
      const missingSkills = job.requiredSkills.filter(skill => !evaluationWithNormalizedSkills.skills.includes(skill))
      const score = job.requiredSkills.length > 0 ? matchedSkills.length / job.requiredSkills.length : 0
      console.log(`[ProcessCV]   Matching "${job.title}":`, {
        requiredSkills: job.requiredSkills,
        matchedSkills,
        missingSkills,
        score
      })
      return {
        jobId: job.guid,
        title: job.title,
        source: job.source,
        company: job.companyName,
        location: job.locationRestrictions || 'Remote',
        url: job.applicationLink,
        requiredSkills: job.requiredSkills,
        match: { score, matchedSkills, missingSkills },
        application: { applied: false, appliedAt: null },
        interviewPrep: { questions: [], focusAreas: [] }
      }
    })

    const jobSearchRun: Omit<JobSearchRunEntity, '_id'> = {
      ...evaluationWithNormalizedSkills,
      userId: request.userId,
      jobs: mappedJobs,
      createdAt: new Date().toISOString()
    }
    console.log('[ProcessCV] Step 5 OK: Job search run built', {
      userId: jobSearchRun.userId,
      totalJobs: jobSearchRun.jobs.length,
      createdAt: jobSearchRun.createdAt
    })

    // Step 6: Persist
    console.log('[ProcessCV] Step 6: Saving job search run to repository...')
    const newJobSearchRun = await this.jobSearchRunRepository.create(jobSearchRun)
    console.log('[ProcessCV] Step 6 OK: Saved', { id: newJobSearchRun?._id })

    console.log('[ProcessCV] Done ✓')
    return newJobSearchRun
  }

  private normalizeSkills (skills: string[]): string[] {
    return [...new Set(
      skills
        .map(this.normalizeSkill.bind(this))
        .filter((skill): skill is string => Boolean(skill))
    )]
  }

  private normalizeSkill (skill: string): string | null {
    console.log('skill', skill)
    const key = this.createSkillKey(skill)
    console.log('key', key)

    if (!key) return null

    return SKILL_ALIASES[key] ?? skill.trim()
  }

  private createSkillKey (skill: string): string {
    return skill
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, 'and')
      .replace(/\+/g, 'plus')
      .replace(/#/g, 'sharp')
      .replace(/\.js/g, 'js')
      .replace(/\.net/g, 'dotnet')
      .replace(/[^a-z0-9]/g, '')
  }
}
