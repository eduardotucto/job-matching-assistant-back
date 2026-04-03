import type { UserEntity } from '@user/domain'
import type { UserRepository } from '@user/domain'
import { Collection, ObjectId } from 'mongodb'
import { getDb } from '@/database/mongoClient.ts'

const COLLECTION_NAME = 'users'

export class UserRepositoryMongo implements UserRepository {
  private getCollection (): Collection<UserEntity> {
    return getDb().collection<UserEntity>(COLLECTION_NAME)
  }

  async list (): Promise<UserEntity[]> {
    const users = await this.getCollection()
      .find()
      .sort({ createdAt: -1 })
      .toArray()

    return users
  }

  async getById (id: string): Promise<UserEntity | null> {
    if (!ObjectId.isValid(id)) return null
    const doc = await this.getCollection()
      .findOne({ _id: new ObjectId(id) })

    return doc
  }

  async getByEmailForAuth (email: string): Promise<UserEntity | null> {
    const doc = await this.getCollection()
      .findOne({ email })

    return doc
  }

  async create (input: { name: string; email: string; password: string }): Promise<UserEntity> {
    const doc: Omit<UserEntity, '_id'> = {
      name: input.name,
      email: input.email,
      password: input.password,
      createdAt: new Date(),
    }
    const result = await this.getCollection().insertOne(doc as UserEntity)
    return {
      _id: result.insertedId.toString(),
      ...input,
    }
  }
}
