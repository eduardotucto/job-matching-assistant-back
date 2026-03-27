import type { AppModule } from '../moduleContract.ts'
import { authRoutes } from './infrastructure/http/authRoutes.ts'

export function buildAuthModule (): AppModule {
  return {
    name: 'auth',
    async register (app) {
      app.register(authRoutes)
    },
  }
}
