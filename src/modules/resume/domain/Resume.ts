export type Resume = {
  id: string;
  user_id: string;
  file_url: string;
  parsed_json: unknown;
  created_at: string; // ISO string
}
