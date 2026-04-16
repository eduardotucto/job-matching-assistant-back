import axios from 'axios'
import type { JobSearchParameters, JobSearchService, MatchedJob } from '@jobSearchRun/domain'

interface HimalayasApiResponse {
  offset: number
  limit: number
  totalCount: number
  jobs: MatchedJob[]
}

export const SKILL_PATTERNS: Record<string, string[]> = {
  // Frontend
  react: ['react', 'reactjs', 'react.js', 'react js'],
  nextjs: ['next', 'nextjs', 'next.js'],
  vue: ['vue', 'vuejs', 'vue.js'],
  nuxt: ['nuxt', 'nuxtjs', 'nuxt.js'],
  angular: ['angular'],
  angularjs: ['angularjs', 'angular.js'],
  svelte: ['svelte'],
  html: ['html', 'html5'],
  css: ['css', 'css3'],
  sass: ['sass'],
  scss: ['scss'],
  less: ['less'],
  tailwind: ['tailwind', 'tailwindcss'],
  bootstrap: ['bootstrap'],
  materialui: ['material ui', 'mui'],
  chakraui: ['chakra ui'],
  shadcn: ['shadcn', 'shadcn/ui'],

  // JS / TS
  javascript: ['javascript', 'js', 'ecmascript'],
  typescript: ['typescript', 'ts'],
  es6: ['es6', 'es2015'],

  // Backend
  nodejs: ['node', 'nodejs', 'node.js', 'node js'],
  express: ['express', 'expressjs'],
  nestjs: ['nestjs', 'nest.js'],
  fastify: ['fastify'],
  spring: ['spring', 'spring boot'],
  django: ['django'],
  flask: ['flask'],
  laravel: ['laravel'],
  rails: ['rails', 'ruby on rails'],

  // Languages
  java: ['java'],
  python: ['python'],
  go: ['go', 'golang'],
  csharp: ['c#', 'csharp'],
  dotnet: ['.net', 'dotnet'],
  php: ['php'],
  ruby: ['ruby'],
  kotlin: ['kotlin'],
  swift: ['swift'],
  rust: ['rust'],
  cpp: ['c++', 'cpp'],
  c: [' c '], // ojo: evitar falsos positivos

  // Databases
  mysql: ['mysql'],
  postgres: ['postgres', 'postgresql'],
  mongodb: ['mongodb', 'mongo', 'mongo db'],
  mariadb: ['mariadb'],
  sqlite: ['sqlite'],
  redis: ['redis'],
  elasticsearch: ['elasticsearch'],
  opensearch: ['opensearch'],
  dynamodb: ['dynamodb'],
  firestore: ['firestore'],

  // APIs / Arch
  rest: ['rest', 'rest api', 'rest apis'],
  graphql: ['graphql'],
  grpc: ['grpc'],
  soap: ['soap'],
  microservices: ['microservices', 'micro services'],
  serverless: ['serverless'],
  eventdriven: ['event driven', 'event-driven'],

  // Cloud / DevOps
  aws: ['aws', 'amazon web services'],
  azure: ['azure'],
  gcp: ['gcp', 'google cloud', 'google cloud platform'],
  docker: ['docker'],
  kubernetes: ['kubernetes', 'k8s'],
  terraform: ['terraform'],
  cicd: ['ci/cd', 'cicd'],
  githubactions: ['github actions'],
  gitlabci: ['gitlab ci'],
  jenkins: ['jenkins'],

  // Testing
  tdd: ['tdd', 'test driven development'],
  unittesting: ['unit testing'],
  integrationtesting: ['integration testing'],
  e2e: ['e2e', 'end to end'],
  jest: ['jest'],
  mocha: ['mocha'],
  chai: ['chai'],
  cypress: ['cypress'],
  playwright: ['playwright'],
  selenium: ['selenium'],

  // Tools
  git: ['git'],
  github: ['github'],
  gitlab: ['gitlab'],
  bitbucket: ['bitbucket'],
  linux: ['linux'],
  unix: ['unix'],
  bash: ['bash'],
  shell: ['shell'],
  webpack: ['webpack'],
  vite: ['vite'],
  babel: ['babel'],
  npm: ['npm'],
  yarn: ['yarn'],
  pnpm: ['pnpm'],

  // Others
  websocket: ['websocket', 'websockets'],
  graphqlapi: ['graphql api'],
  restapi: ['restful'],
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

    return data.jobs.map(job => ({
      title: job.title,
      excerpt: job.excerpt,
      source: 'Himalaya',
      companyName: job.companyName,
      // companySlug: job.companySlug,
      // companyLogo: job.companyLogo,
      // employmentType: job.employmentType,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      seniority: job.seniority,
      currency: job.currency,
      locationRestrictions: job.locationRestrictions ? job.locationRestrictions[0] : 'Remote',
      // timezoneRestrictions: job.timezoneRestrictions,
      // categories: job.categories,
      // parentCategories: job.parentCategories,
      description: job.description,
      skills: this.extractSkillsFromHtml(job.description),
      pubDate: job.pubDate,
      // expiryDate: job.expiryDate,
      applicationLink: job.applicationLink,
      guid: job.guid,
    })).slice(0, 5)
  }

  private extractSkillsFromHtml (html: string): string[] {
    const text = this.normalizeTextFromHtml(html)

    const foundSkills: string[] = []

    for (const [skill, patterns] of Object.entries(SKILL_PATTERNS)) {
      for (const pattern of patterns) {
        if (this.includesWord(text, pattern)) {
          foundSkills.push(skill)
          break
        }
      }
    }

    return [...new Set(foundSkills)]
  }

  private includesWord (text: string, word: string): boolean {
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    return regex.test(text)
  }

  private normalizeTextFromHtml (html: string): string {
    return html
    // remove html tags
      .replace(/<[^>]*>/g, ' ')
    // decode common html entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, 'and')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
    // normalize accents
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    // lowercase
      .toLowerCase()
  }
}
