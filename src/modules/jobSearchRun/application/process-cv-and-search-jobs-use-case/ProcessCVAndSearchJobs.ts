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

    if (cvFile.mimetype !== 'application/pdf') {
      throw new Error('Invalid CV file type. Only PDF files are accepted.')
    }

    const evaluation = await this.aiEvaluationService.evaluateCv(cvFile)
    if (!evaluation) throw new Error('Failed to evaluate CV')

    const jobs = await this.jobSearchService.searchJobs({
      role: evaluation.role,
      seniority: evaluation.metadata.seniorityLevel,
      skills: evaluation.skills
    })
    if (!jobs) throw new Error('Failed to search for jobs')

    const jobsWithSkillsMatched = jobs.map(job => {
      const normalized = this.normalizeSkills(job.skills)
      return { ...job, requiredSkills: normalized }
    })

    const evaluationWithNormalizedSkills = {
      ...evaluation,
      skills: this.normalizeSkills(evaluation.skills)
    }

    const mappedJobs = jobsWithSkillsMatched.map(job => {
      const matchedSkills = job.requiredSkills.filter(skill => evaluationWithNormalizedSkills.skills.includes(skill))
      const missingSkills = job.requiredSkills.filter(skill => !evaluationWithNormalizedSkills.skills.includes(skill))
      const score = job.requiredSkills.length > 0 ? matchedSkills.length / job.requiredSkills.length : 0
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
      fileName: cvFile.filename,
      jobs: mappedJobs,
      createdAt: new Date()
    }

    const newJobSearchRun = await this.jobSearchRunRepository.create(jobSearchRun)
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
    const key = this.createSkillKey(skill)

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
