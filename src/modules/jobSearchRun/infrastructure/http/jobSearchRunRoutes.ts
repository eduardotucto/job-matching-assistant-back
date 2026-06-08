import type { FastifyPluginAsync } from 'fastify'
import type { JobMatch } from '@jobSearchRun/domain'
import {
  ListJobSearchRunsByUserIdUseCase,
  GetJobSearchRunByIdUseCase,
  CreateJobSearchRunUseCase,
  UpdateJobSearchRunUseCase,
  DeleteJobSearchRunUseCase
} from '@jobSearchRun/application'

type JobSearchRunRoutesDeps = {
  listJobSearchRunsByUserId: ListJobSearchRunsByUserIdUseCase
  getJobSearchRunById: GetJobSearchRunByIdUseCase
  createJobSearchRun: CreateJobSearchRunUseCase
  updateJobSearchRun: UpdateJobSearchRunUseCase
  deleteJobSearchRun: DeleteJobSearchRunUseCase
}

type JobSearchRunCreateBody = {
  fullName: string
  role: string
  experience: string
  education: string
  jobs: JobMatch[]
}

type JobSearchRunUpdateBody = {
  fullName?: string
  role?: string
  experience?: string
  education?: string
  jobs?: JobMatch[]
}

export function jobSearchRunRoutes (deps: JobSearchRunRoutesDeps): FastifyPluginAsync {
  return async (fastify) => {
    fastify.get('/job-search-runs/me', async (req) => {
      const userId = req.authUserId as string

      return deps.listJobSearchRunsByUserId.execute(userId)
    })

    fastify.post('/job-search-runs/me', async (req, reply) => {
      const userId = req.authUserId as string

      const body = req.body as JobSearchRunCreateBody

      const created = await deps.createJobSearchRun.execute({
        userId,
        fullName: body.fullName,
        role: body.role,
        experience: body.experience,
        education: body.education,
        jobs: body.jobs,
        topMissingSkills: body.topMissingSkills,
      })

      reply.code(201)
      return created
    })

    fastify.get('/job-search-runs/:id', async (req, reply) => {
      const userId = req.authUserId as string
      const { id } = req.params as { id: string }
      const jobSearchRun = await deps.getJobSearchRunById.execute(id)

      if (!jobSearchRun) {
        reply.code(404)
        return { message: 'JobSearchRun not found' }
      }

      if (jobSearchRun.userId !== userId) {
        reply.code(403)
        return { message: 'Forbidden' }
      }

      return jobSearchRun
    })

    fastify.patch('/job-search-runs/:id', async (req, reply) => {
      const userId = req.authUserId as string

      const { id } = req.params as { id: string }
      const jobSearchRun = await deps.getJobSearchRunById.execute(id)

      if (!jobSearchRun) {
        reply.code(404)
        return { message: 'JobSearchRun not found' }
      }

      if (jobSearchRun.userId !== userId) {
        reply.code(403)
        return { message: 'Forbidden' }
      }

      const body = req.body as JobSearchRunUpdateBody

      const updated = await deps.updateJobSearchRun.execute(id, {
        ...jobSearchRun,
        fullName: body.fullName ?? jobSearchRun.fullName,
        role: body.role ?? jobSearchRun.role,
        experience: body.experience ?? jobSearchRun.experience,
        education: body.education ?? jobSearchRun.education,
        jobs: body.jobs ?? jobSearchRun.jobs,
        topMissingSkills: body.topMissingSkills ?? jobSearchRun.topMissingSkills,
      })

      return updated
    })

    fastify.delete('/job-search-runs/:id', async (req, reply) => {
      const userId = req.authUserId as string

      const { id } = req.params as { id: string }
      const jobSearchRun = await deps.getJobSearchRunById.execute(id)

      if (!jobSearchRun) {
        reply.code(404)
        return { message: 'JobSearchRun not found' }
      }

      if (jobSearchRun.userId !== userId) {
        reply.code(403)
        return { message: 'Forbidden' }
      }

      await deps.deleteJobSearchRun.execute(id)
      reply.code(204)
    })
  }
}
