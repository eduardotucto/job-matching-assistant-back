import { buildApp } from './src/app/createApp.ts'
import { getAppModules } from './src/modules/registry.ts'
import { connectMongoFromEnv } from './src/database/mongoClient.ts'

const app = buildApp()

const mongo = await connectMongoFromEnv()
app.log.info({ mongoUri: mongo.uri }, 'Mongo connection established')

for (const mod of getAppModules()) {
  await mod.register(app)
}

await app.listen({ port: 3000, host: '0.0.0.0' })
