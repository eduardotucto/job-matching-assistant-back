import type { ObjectId } from 'mongodb'

export type UserEntity = {
  _id: ObjectId | string
  name: string
  email: string
  password: string
  createdAt?: Date
}
