import type { Multipart } from '@fastify/multipart'

export class ProcessCVDto {
  userId!: string
  cvFile!: Multipart
}
