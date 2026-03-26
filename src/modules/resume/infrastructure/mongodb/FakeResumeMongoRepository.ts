import type { Resume } from '@resume/domain/Resume.ts'
import type { ResumeRepository } from '@resume/domain/ResumeRepository.ts'

type MongoResumeDoc = {
  _id: string;
  user_id: string;
  file_url: string;
  parsed_json: unknown;
  created_at: string; // ISO string
}

export class FakeResumeMongoRepository implements ResumeRepository {
  private readonly docs: MongoResumeDoc[] = [
    {
      _id: 'r1',
      user_id: 'u1',
      file_url: 'https://example.com/resumes/alice-cv.pdf',
      parsed_json: { skills: ['ts', 'node'], experience_years: 3 },
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ]

  private nextId (): string {
    return `r${this.docs.length + 1}`
  }

  private async delay (ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  async listByUserId (userId: string): Promise<Resume[]> {
    await this.delay(35)
    return this.docs
      .filter((d) => d.user_id === userId)
      .map((d) => ({
        id: d._id,
        user_id: d.user_id,
        file_url: d.file_url,
        parsed_json: d.parsed_json,
        created_at: d.created_at,
      }))
  }

  async getById (id: string): Promise<Resume | null> {
    await this.delay(35)
    const doc = this.docs.find((d) => d._id === id)
    if (!doc) return null

    return {
      id: doc._id,
      user_id: doc.user_id,
      file_url: doc.file_url,
      parsed_json: doc.parsed_json,
      created_at: doc.created_at,
    }
  }

  async create (input: {
    user_id: string;
    file_url: string;
    parsed_json: unknown;
    created_at: string;
  }): Promise<Resume> {
    await this.delay(35)
    const newDoc: MongoResumeDoc = {
      _id: this.nextId(),
      user_id: input.user_id,
      file_url: input.file_url,
      parsed_json: input.parsed_json,
      created_at: input.created_at,
    }

    this.docs.push(newDoc)

    return {
      id: newDoc._id,
      user_id: newDoc.user_id,
      file_url: newDoc.file_url,
      parsed_json: newDoc.parsed_json,
      created_at: newDoc.created_at,
    }
  }
}
