import type { JobSearchRun, JobMatch, MissingSkill } from '@jobSearchRun/domain/JobSearchRun.ts'
import type { JobSearchRunRepository } from '@jobSearchRun/domain/JobSearchRunRepository.ts'
import { ObjectId, Collection } from 'mongodb'
import { getDb } from '@/database/mongoClient.ts'

const COLLECTION_NAME = 'job_search_runs'

export class JobSearchRunRepositoryMongo implements JobSearchRunRepository {
  private getCollection (): Collection<JobSearchRun> {
    return getDb().collection<JobSearchRun>(COLLECTION_NAME)
  }

  async listByUserId (userId: string): Promise<JobSearchRun[]> {
    const docs = await this.getCollection()
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray()

    return docs
  }

  async update (id: string, jobSearchRun: JobSearchRun): Promise<JobSearchRun> {
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

  async create (input: {
    userId: string;
    fullName: string;
    role: string;
    experience: string;
    education: string;
    jobs: JobMatch[];
    topMissingSkills: MissingSkill[];
    createdAt: string;
  }): Promise<JobSearchRun> {
    const doc: Omit<JobSearchRun, '_id'> = {
      userId: input.userId,
      fullName: input.fullName,
      role: input.role,
      experience: input.experience,
      education: input.education,
      jobs: input.jobs,
      topMissingSkills: input.topMissingSkills,
      createdAt: input.createdAt,
    }

    const result = await this.getCollection().insertOne(doc as JobSearchRun)
    return {
      _id: result.insertedId.toString(),
      ...input,
    }
  }

  async delete (id: string): Promise<void> {
    if (!ObjectId.isValid(id)) throw new Error('Invalid ID')
    await this.getCollection().deleteOne({ _id: new ObjectId(id) })
  }

  async getById (id: string): Promise<JobSearchRun | null> {
    if (!ObjectId.isValid(id)) return null
    const doc = await this.getCollection().findOne({ _id: new ObjectId(id) })
    if (!doc) return null

    return doc
  }
}
