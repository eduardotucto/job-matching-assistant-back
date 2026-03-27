import type { FastifyPluginAsync } from 'fastify'
import { CreateResumeUseCase } from '@resume/application/CreateResumeUseCase.ts'
import { GetResumeByIdUseCase } from '@resume/application/GetResumeByIdUseCase.ts'
import { ListResumesByUserIdUseCase } from '@resume/application/ListResumesByUserIdUseCase.ts'

type ResumeRoutesDeps = {
  listResumesByUserId: ListResumesByUserIdUseCase;
  getResumeById: GetResumeByIdUseCase;
  createResume: CreateResumeUseCase;
}

type ResumeCreateBody = {
  file_url: string;
  parsed_json: unknown;
}

export function resumeRoutes (deps: ResumeRoutesDeps): FastifyPluginAsync {
  return async (fastify) => {
    fastify.get('/resumes/me', async (req, reply) => {
      const userId = req.authUserId
      if (!userId) {
        reply.code(401)
        return { message: 'Unauthorized' }
      }

      return deps.listResumesByUserId.execute(userId)
    })

    fastify.post('/resumes/me', async (req, reply) => {
      const userId = req.authUserId
      if (!userId) {
        reply.code(401)
        return { message: 'Unauthorized' }
      }

      const body = req.body as ResumeCreateBody

      // Mock: no validamos parsed_json; lo dejamos como lo mandó el cliente.
      const created = await deps.createResume.execute({
        user_id: userId,
        file_url: body.file_url,
        parsed_json: body.parsed_json,
        created_at: new Date().toISOString(),
      })

      reply.code(201)
      return created
    })

    fastify.get('/resumes/:id', async (req, reply) => {
      const { id } = req.params as { id: string }
      const resume = await deps.getResumeById.execute(id)

      if (!resume) {
        reply.code(404)
        return { message: 'Resume not found' }
      }

      if (resume.user_id !== req.authUserId) {
        reply.code(403)
        return { message: 'Forbidden' }
      }

      return resume
    })
  }
}
