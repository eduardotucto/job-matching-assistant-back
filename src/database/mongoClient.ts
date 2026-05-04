import { MongoClient } from 'mongodb'

const MONGO_URI = Bun.env.MONGO_URI ?? ''
const MONGO_DB_NAME = Bun.env.MONGO_DB_NAME ?? ''

const client = new MongoClient(MONGO_URI)
let connected = false

export async function connectMongoFromEnv (): Promise<{ uri: string; dbName: string }> {
  if (!connected) {
    await client.connect()
    connected = true
  }

  return {
    uri: MONGO_URI,
    dbName: MONGO_DB_NAME,
  }
}

export function getDb () {
  return client.db(MONGO_DB_NAME)
}
