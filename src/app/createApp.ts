import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify'
import { verifyToken } from '@/security/tokenService.ts'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'

export function buildApp (): FastifyInstance {
  const app = Fastify({ logger: true })
  app.register(cors, { origin: true })
  app.register(multipart)

  app.get('/health', async () => {
    return { status: 'ok' }
  })

  app.addHook('onRequest', async (req, reply) => {
    const PUBLIC_ROUTES = [
      '/health',
      '/auth/login',
      '/auth/register'
    ]

    if (PUBLIC_ROUTES.includes(req.url)) return

    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      reply.code(401)
      return reply.send({ message: 'Missing bearer token' })
    }

    const token = authHeader.slice('Bearer '.length).trim()
    const payload = verifyToken(token)
    if (!payload) {
      reply.code(401)
      return reply.send({ message: 'Invalid or expired token' })
    }

    req.authUserId = payload.userId
  })

  return app
}
