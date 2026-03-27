import type { User, UserWithPassword } from '@user/domain/User.ts'
import type { UserRepository } from '@user/domain/UserRepository.ts'
import { ObjectId } from 'mongodb'
import { getDb } from '@/database/mongoClient.ts'

type MongoUserDoc = {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  created_at?: string;
}

export class UserRepositoryMongo implements UserRepository {
  async list (): Promise<User[]> {
    const db = getDb()
    const users = db.collection<MongoUserDoc>('users')
    const docs = await users.find().toArray()
    return docs.map((d: MongoUserDoc) => ({
      id: d._id.toHexString(),
      name: d.name,
      email: d.email,
    }))
  }

  async getById (id: string): Promise<User | null> {
    if (!ObjectId.isValid(id)) return null
    const db = getDb()
    const users = db.collection<MongoUserDoc>('users')
    const doc = await users.findOne({ _id: new ObjectId(id) })
    if (!doc) return null

    return {
      id: doc._id.toHexString(),
      name: doc.name,
      email: doc.email,
    }
  }

  async getByEmailForAuth (email: string): Promise<UserWithPassword | null> {
    const db = getDb()
    const users = db.collection<MongoUserDoc>('users')
    const doc = await users.findOne({ email: { $regex: `^${email}$`, $options: 'i' } })
    if (!doc) return null

    return {
      id: doc._id.toHexString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
    }
  }

  async create (input: { name: string; email: string; password: string }): Promise<User> {
    const db = getDb()
    const users = db.collection<{
      name: string;
      email: string;
      password: string;
      created_at: string;
    }>('users')

    const doc = {
      name: input.name,
      email: input.email,
      password: input.password,
      created_at: new Date().toISOString(),
    }

    const inserted = await users.insertOne(doc)

    return {
      id: inserted.insertedId.toHexString(),
      name: doc.name,
      email: doc.email,
    }
  }
}
