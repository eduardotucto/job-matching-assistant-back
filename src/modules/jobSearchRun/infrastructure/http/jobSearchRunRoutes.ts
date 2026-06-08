import type { FastifyPluginAsync } from 'fastify'
import type { JobMatch } from '@jobSearchRun/domain'
import {
  ListJobSearchRunsByUserIdUseCase,
  GetJobSearchRunByIdUseCase,
  CreateJobSearchRunUseCase,
  UpdateJobSearchRunUseCase,
  DeleteJobSearchRunUseCase
} from '@jobSearchRun/application'
import { Errors } from '@/errors'

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

    fastify.patch('/job-search-runs/:id/application', async (req) => {
      const userId = req.authUserId as string
      const { id } = req.params as { id: string }
      const { jobId, applied } = req.body as { jobId: string; applied: boolean }

      const jobSearchRun = await deps.getJobSearchRunById.execute(id)

      if (!jobSearchRun || jobSearchRun.userId.toString() !== userId) {
        throw Errors.ELEMENT_NOT_FOUND()
      }

      const jobIndex = jobSearchRun.jobs.findIndex(job => job.jobId === jobId)
      if (jobIndex === -1) throw Errors.ELEMENT_NOT_FOUND()

      jobSearchRun.jobs[jobIndex]!.application!.applied = applied
      jobSearchRun.jobs[jobIndex]!.application!.appliedAt = applied ? new Date() : null

      const updatedEntity = await deps.updateJobSearchRun.execute(id, jobSearchRun)

      return updatedEntity
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
