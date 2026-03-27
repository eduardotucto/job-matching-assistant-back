export type UserDoc = {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export const fakeUsersCollection: UserDoc[] = [
  { _id: 'u1', name: 'Alice', email: 'alice@example.com', password: '123456' },
  { _id: 'u2', name: 'Bob', email: 'bob@example.com', password: '123456' },
]
