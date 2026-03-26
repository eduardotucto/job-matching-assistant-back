import type { User } from '@user/domain/User.ts'
import type { UserRepository } from '@user/domain/UserRepository.ts'

// Simula documentos estilo Mongo (con _id) y tiempos de red.
type MongoUserDoc = {
  _id: string;
  name: string;
  email: string;
}

export class FakeUserMongoRepository implements UserRepository {
  private readonly docs: MongoUserDoc[] = [
    { _id: 'u1', name: 'Alice', email: 'alice@example.com' },
    { _id: 'u2', name: 'Bob', email: 'bob@example.com' },
  ]

  private async delay (ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  async list (): Promise<User[]> {
    await this.delay(40)
    return this.docs.map((d) => ({
      id: d._id,
      name: d.name,
      email: d.email,
    }))
  }

  async getById (id: string): Promise<User | null> {
    await this.delay(40)
    const doc = this.docs.find((d) => d._id === id)
    if (!doc) return null

    return {
      id: doc._id,
      name: doc.name,
      email: doc.email,
    }
  }
}
