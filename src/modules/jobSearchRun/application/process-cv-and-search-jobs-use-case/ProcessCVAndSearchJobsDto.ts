import type { MultipartFile } from '@fastify/multipart'

export class ProcessCVDto {
  userId!: string
  cvFile!: MultipartFile
}
