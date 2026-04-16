import type {
  JobSearchRunEntity,
  JobSearchRunRepository
} from '@jobSearchRun/domain'
import { ObjectId, Collection } from 'mongodb'
import { getDb } from '@/database/mongoClient.ts'

const COLLECTION_NAME = 'job_search_runs'

export class JobSearchRunRepositoryMongo implements JobSearchRunRepository {
  private getCollection (): Collection<JobSearchRunEntity> {
    return getDb().collection<JobSearchRunEntity>(COLLECTION_NAME)
  }

  async listByUserId (userId: string): Promise<JobSearchRunEntity[]> {
    const docs = await this.getCollection()
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray()

    return docs
  }

  async update (id: string, jobSearchRun: JobSearchRunEntity): Promise<JobSearchRunEntity> {
    if (!ObjectId.isValid(id)) throw new Error('Invalid ID')

    const result = await this.getCollection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          full_name: jobSearchRun.fullName,
          role: jobSearchRun.role,
          experience: jobSearchRun.experience,
          education: jobSearchRun.education,
          jobs: jobSearchRun.jobs,
          top_missing_skills: jobSearchRun.topMissingSkills,
        },
      },
      { returnDocument: 'after' }
    )

    if (!result) throw new Error('JobSearchRun not found')
    return result
  }

  async create (input: Omit<JobSearchRunEntity, '_id'>): Promise<JobSearchRunEntity> {
    const result = await this.getCollection().insertOne({
      ...input,
      userId: new ObjectId(input.userId),
    } as JobSearchRunEntity)
    return {
      _id: result.insertedId.toString(),
      ...input,
    }
  }

  async delete (id: string): Promise<void> {
    if (!ObjectId.isValid(id)) throw new Error('Invalid ID')
    await this.getCollection().deleteOne({ _id: new ObjectId(id) })
  }

  async getById (id: string): Promise<JobSearchRunEntity | null> {
    if (!ObjectId.isValid(id)) return null
    const doc = await this.getCollection().findOne({ _id: new ObjectId(id) })
    if (!doc) return null

    return doc
  }
}
