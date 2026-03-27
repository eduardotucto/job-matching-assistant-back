import type { AppModule } from './moduleContract'
import { buildAuthModule } from './auth/authModule.ts'
import { buildUserModule } from './user/userModule.ts'
import { buildResumeModule } from './resume/resumeModule.ts'

export function getAppModules (): AppModule[] {
  return [buildAuthModule(), buildUserModule(), buildResumeModule()]
}
