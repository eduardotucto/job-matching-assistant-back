import type { FastifyPluginAsync } from 'fastify'
import { GetUserByIdUseCase } from '@user/application/UserServices.ts'

type UserRoutesDeps = {
  getUserById: GetUserByIdUseCase;
}

export function userRoutes (deps: UserRoutesDeps): FastifyPluginAsync {
  return async (fastify) => {
    fastify.get('/users/me', async (req, reply) => {
      const userId = req.authUserId
      if (!userId) {
        reply.code(401)
        return { message: 'Unauthorized' }
      }
      const user = await deps.getUserById.execute(userId)

      if (!user) {
        reply.code(404)
        return { message: 'User not found' }
      }

      return user
    })
  }
}
