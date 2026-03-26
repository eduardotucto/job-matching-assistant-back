import type { AppModule } from './moduleContract'
import { buildUserModule } from './user/user.module.ts'

export function getAppModules (): AppModule[] {
  return [buildUserModule()]
}
