import type { FastifyPluginAsync } from 'fastify'
import { compare, hash } from 'bcrypt'
import { createToken } from '@/security/tokenService.ts'
import type { UserAuthServices } from '@user/userModule.ts'

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

export function authRoutes (services: UserAuthServices): FastifyPluginAsync {
  return async (fastify) => {
    fastify.post('/auth/login', async (req, reply) => {
      const body = req.body as LoginBody

      if (!body?.email || !body?.password) {
        reply.code(400)
        return { message: 'email and password are required' }
      }

      const user = await services.getUserByEmailForAuth.execute(body.email)
      if (!user) {
        reply.code(401)
        return { message: 'Invalid credentials' }
      }

      const validPassword = await compare(body.password, user.password)
      if (!validPassword) {
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

      const existing = await services.getUserByEmailForAuth.execute(body.email)
      if (existing) {
        reply.code(409)
        return { message: 'Email already registered' }
      }

      const fallbackName = body.email.split('@')[0] ?? 'User'
      const hashedPassword = await hash(body.password, 10)
      const created = await services.createUser.execute({
        name: body.name?.trim() || fallbackName,
        email: body.email,
        password: hashedPassword,
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
}
