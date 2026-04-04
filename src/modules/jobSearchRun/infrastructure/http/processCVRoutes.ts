import type { FastifyPluginAsync } from 'fastify'
import type { ProcessCVAndSearchJobsUseCase } from '@jobSearchRun/application'

type ProcessCVRoutesDeps = {
  processCVAndSearchJobsUseCase: ProcessCVAndSearchJobsUseCase
}

type ProcessCVBody = {
  cvText: string
}

export function processCVRoutes (deps: ProcessCVRoutesDeps): FastifyPluginAsync {
  return async (fastify) => {
    fastify.post('/process-cv', async (req, reply) => {
      const userId = req.authUserId as string
      const body = req.body as ProcessCVBody

      const result = await deps.processCVAndSearchJobsUseCase.execute({
        userId,
        cvText: body.cvText
      })

      reply.code(201)
      return result
    })
    fastify.get('/process-cv', async (req, reply) => {
      reply.code(200)
      return { message: 'Endpoint to process CVs' }
    })
  }
}
