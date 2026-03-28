import type { AppModule } from './moduleContract'
import { buildAuthModule } from './auth/authModule.ts'
import { buildUserModuleAndServices } from './user/userModule.ts'
import { buildJobSearchRunModule } from './jobSearchRun/jobSearchRunModule.ts'

export function getAppModules (): AppModule[] {
  const user = buildUserModuleAndServices()
  return [
    buildAuthModule(user.authServices),
    user.module,
    buildJobSearchRunModule()
  ]
}
