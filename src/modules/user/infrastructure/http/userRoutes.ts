import type { FastifyPluginAsync } from 'fastify'
import { ListUsersUseCase } from '@user/application/ListUsersUseCase.ts'
import { GetUserByIdUseCase } from '@user/application/GetUserByIdUseCase.ts'

type UserRoutesDeps = {
  listUsers: ListUsersUseCase;
  getUserById: GetUserByIdUseCase;
}

export function userRoutes (deps: UserRoutesDeps): FastifyPluginAsync {
  return async (fastify) => {
    fastify.get('/users', async () => {
      return deps.listUsers.execute()
    })

    fastify.get<{ Params: { id: string } }>('/users/:id', async (req, reply) => {
      const user = await deps.getUserById.execute(req.params.id)

      if (!user) {
        reply.code(404)
        return { message: 'User not found' }
      }

      return user
    })
  }
}
