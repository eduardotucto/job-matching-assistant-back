import type { AppModule } from './moduleContract'
import { buildAuthModule } from './auth/authModule.ts'
import { buildUserModuleAndServices } from './user/userModule.ts'
import { buildResumeModule } from './resume/resumeModule.ts'

export function getAppModules (): AppModule[] {
  const user = buildUserModuleAndServices()
  return [buildAuthModule(user.authServices), user.module, buildResumeModule()]
}
