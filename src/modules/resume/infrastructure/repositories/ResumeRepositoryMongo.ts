import type { Resume } from '@resume/domain/Resume.ts'
import type { ResumeRepository } from '@resume/domain/ResumeRepository.ts'
import { ObjectId } from 'mongodb'
import { getDb } from '@/database/mongoClient.ts'

type MongoResumeDoc = {
  _id: ObjectId;
  user_id: string;
  file_url: string;
  parsed_json: unknown;
  created_at: string;
}

export class ResumeRepositoryMongo implements ResumeRepository {
  async listByUserId (userId: string): Promise<Resume[]> {
    const db = getDb()
    const resumes = db.collection<MongoResumeDoc>('resumes')
    const docs = await resumes
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .toArray()

    return docs.map((d: MongoResumeDoc) => ({
      id: d._id.toHexString(),
      user_id: d.user_id,
      file_url: d.file_url,
      parsed_json: d.parsed_json,
      created_at: d.created_at,
    }))
  }

  async getById (id: string): Promise<Resume | null> {
    if (!ObjectId.isValid(id)) return null
    const db = getDb()
    const resumes = db.collection<MongoResumeDoc>('resumes')
    const doc = await resumes.findOne({ _id: new ObjectId(id) })
    if (!doc) return null

    return {
      id: doc._id.toHexString(),
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
    const db = getDb()
    const resumes = db.collection<MongoResumeDoc>('resumes')
    const newDoc: MongoResumeDoc = {
      _id: new ObjectId(),
      user_id: input.user_id,
      file_url: input.file_url,
      parsed_json: input.parsed_json,
      created_at: input.created_at,
    }

    await resumes.insertOne(newDoc)

    return {
      id: newDoc._id.toHexString(),
      user_id: newDoc.user_id,
      file_url: newDoc.file_url,
      parsed_json: newDoc.parsed_json,
      created_at: newDoc.created_at,
    }
  }
}
