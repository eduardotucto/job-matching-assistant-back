import type { FastifyPluginAsync } from 'fastify'
import type { ProcessCVAndSearchJobsUseCase } from '@jobSearchRun/application'

type ProcessCVRoutesDeps = {
  processCVAndSearchJobsUseCase: ProcessCVAndSearchJobsUseCase
}

export function processCVRoutes (deps: ProcessCVRoutesDeps): FastifyPluginAsync {
  return async (fastify) => {
    fastify.post('/process-cv', async (req, reply) => {
      try {
        const cvFile = await req.file()
        const userId = req.authUserId as string

        if (!cvFile) throw new Error('CV file is required')

        const result = await deps.processCVAndSearchJobsUseCase.execute({
          userId,
          cvFile
        })

        reply.code(201)
        return result
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Failed to process CV'
        console.log('[ProcessCV] Error processing CV:', { error: errorMessage })
        return { error: errorMessage }
      }
    })
  }
}
