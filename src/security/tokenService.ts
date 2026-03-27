import { sign, verify } from 'jsonwebtoken'

type JwtPayload = {
  sub: string;
}

const SECRET = import.meta.env.VITE_JWT_SECRET

export function createToken (userId: string): string {
  if (!SECRET) throw new Error('JWT secret is not defined')
  return sign({ sub: userId }, SECRET, { expiresIn: '8h' })
}

export function verifyToken (token: string): { userId: string } | null {
  try {
    if (!SECRET) throw new Error('JWT secret is not defined')
    const payload = verify(token, SECRET) as JwtPayload
    if (!payload.sub) return null
    return { userId: payload.sub }
  } catch {
    return null
  }
}
