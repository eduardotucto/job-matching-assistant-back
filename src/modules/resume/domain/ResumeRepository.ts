import type { Resume } from './Resume.ts'

export interface ResumeRepository {
  listByUserId(userId: string): Promise<Resume[]>;
  getById(id: string): Promise<Resume | null>;
  create(input: {
    user_id: string;
    file_url: string;
    parsed_json: unknown;
    created_at: string;
  }): Promise<Resume>;
}
