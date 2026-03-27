import type { FastifyPluginAsync } from 'fastify'
import { FakeAuthMongoRepository } from '../mongodb/FakeAuthMongoRepository.ts'
import { createToken } from '@/security/tokenService.ts'

type LoginBody = {
  email: string;
  password: string;
}

type RegisterBody = {
  name?: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  const authRepo = new FakeAuthMongoRepository()

  fastify.post('/auth/login', async (req, reply) => {
    const body = req.body as LoginBody

    if (!body?.email || !body?.password) {
      reply.code(400)
      return { message: 'email and password are required' }
    }

    const user = await authRepo.findByEmail(body.email)
    if (!user) {
      reply.code(401)
      return { message: 'Invalid credentials' }
    }

    if (user.password !== body.password) {
      reply.code(401)
      return { message: 'Invalid credentials' }
    }

    const token = createToken(user.id)
    return {
      access_token: token,
      token_type: 'Bearer',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    }
  })

  fastify.post('/auth/register', async (req, reply) => {
    const body = req.body as RegisterBody

    if (!body?.email || !body?.password || !body?.repeatPassword) {
      reply.code(400)
      return { message: 'email, password and repeatPassword are required' }
    }

    if (body.password !== body.repeatPassword) {
      reply.code(400)
      return { message: 'Passwords do not match' }
    }

    const existing = await authRepo.findByEmail(body.email)
    if (existing) {
      reply.code(409)
      return { message: 'Email already registered' }
    }

    const fallbackName = body.email.split('@')[0] ?? 'User'
    const created = await authRepo.create({
      name: body.name?.trim() || fallbackName,
      email: body.email,
      password: body.password,
    })

    const token = createToken(created.id)
    reply.code(201)
    return {
      access_token: token,
      token_type: 'Bearer',
      user: {
        id: created.id,
        name: created.name,
        email: created.email,
      },
    }
  })
}
