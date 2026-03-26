import { buildApp } from './src/app/createApp.ts'
import { getAppModules } from './src/modules/registry.ts'

const app = buildApp()

for (const mod of getAppModules()) {
  await mod.register(app)
}

await app.listen({ port: 3000, host: '0.0.0.0' })
