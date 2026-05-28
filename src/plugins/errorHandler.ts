import type { FastifyPluginCallback, FastifyError, FastifyRequest, FastifyReply } from 'fastify'
import { AppError } from '../errors/AppError'

const errorHandler: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.setErrorHandler((error: FastifyError | AppError, _req: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({
        ok: false,
        code: error.code,
        message: error.message,
      })
    }

    fastify.log.error(error)
    return reply.code(500).send({
      ok: false,
      code: 'INTERNAL_ERROR',
      message: 'Error interno del servidor',
    })
  })

  done()
}

export default errorHandler
