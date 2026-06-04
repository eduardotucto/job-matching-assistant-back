import type { FastifyPluginAsync } from 'fastify'
import { compare, hash } from 'bcrypt'
import { createToken } from '@/security/tokenService.ts'
import type { UserAuthServices } from '@user/userModule.ts'
import { Errors } from '@/errors'

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
        throw Errors.MISSING_FIELDS()
      }

      const user = await services.getUserByEmailForAuth.execute(body.email.trim().toLowerCase())
      if (!user) {
        throw Errors.USER_NOT_FOUND()
      }

      const validPassword = await compare(body.password, user.password)
      if (!validPassword) {
        throw Errors.INVALID_CREDENTIALS()
      }

      const token = createToken(user._id.toString())
      return {
        access_token: token,
        token_type: 'Bearer',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      }
    })

    fastify.post('/auth/register', async (req, reply) => {
      const body = req.body as RegisterBody

      if (!body?.name || !body?.email || !body?.password || !body?.repeatPassword) {
        throw Errors.MISSING_FIELDS()
      }

      if (body.password !== body.repeatPassword) {
        throw Errors.PASSWORDS_MISMATCH()
      }

      const existing = await services.getUserByEmailForAuth.execute(body.email.trim().toLowerCase())
      if (existing) throw Errors.EMAIL_TAKEN()

      const hashedPassword = await hash(body.password, 10)
      const created = await services.createUser.execute({
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        password: hashedPassword,
      })

      const token = createToken(created._id.toString())
      reply.code(201)
      return {
        access_token: token,
        token_type: 'Bearer',
        user: {
          id: created._id.toString(),
          name: created.name,
          email: created.email,
        },
      }
    })
  }
}
