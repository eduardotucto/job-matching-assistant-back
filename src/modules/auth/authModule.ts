import type { AppModule } from '../moduleContract.ts'
import type { UserAuthServices } from '../user/userModule.ts'
import { authRoutes } from './infrastructure/http/authRoutes.ts'

export function buildAuthModule (services: UserAuthServices): AppModule {
  return {
    name: 'auth',
    async register (app) {
      app.register(authRoutes(services))
    },
  }
}
