import type { AppModule } from './moduleContract'
import { buildUserModule } from './user/userModule.ts'
import { buildResumeModule } from './resume/resumeModule.ts'

export function getAppModules (): AppModule[] {
  return [buildUserModule(), buildResumeModule()]
}
