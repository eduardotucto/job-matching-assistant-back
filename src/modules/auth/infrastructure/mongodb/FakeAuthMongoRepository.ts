import { fakeUsersCollection } from '@/shared/infrastructure/fakeStore.ts'

export type AuthUserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
}

export class FakeAuthMongoRepository {
  private readonly docs = fakeUsersCollection

  private nextId (): string {
    return `u${this.docs.length + 1}`
  }

  async findByEmail (email: string): Promise<AuthUserRecord | null> {
    const doc = this.docs.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!doc) return null

    return {
      id: doc._id,
      name: doc.name,
      email: doc.email,
      password: doc.password,
    }
  }

  async create (input: { name: string; email: string; password: string }): Promise<AuthUserRecord> {
    const doc = {
      _id: this.nextId(),
      name: input.name,
      email: input.email,
      password: input.password,
    }

    this.docs.push(doc)

    return {
      id: doc._id,
      name: doc.name,
      email: doc.email,
      password: doc.password,
    }
  }
}
