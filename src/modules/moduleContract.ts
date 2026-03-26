import type { FastifyInstance } from 'fastify'

export type AppModule = {
  name: string;
  register(app: FastifyInstance): void | Promise<void>;
}
