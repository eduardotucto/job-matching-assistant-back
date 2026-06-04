import { AppError } from './AppError'

export const Errors = {
  MISSING_FIELDS: () => new AppError({ statusCode: 400, code: 'MISSING_FIELDS' }),
  PASSWORDS_MISMATCH: () => new AppError({ statusCode: 400, code: 'PASSWORDS_MISMATCH' }),
  EMAIL_TAKEN: () => new AppError({ statusCode: 400, code: 'EMAIL_TAKEN' }),
  UNAUTHORIZED: () => new AppError({ statusCode: 401, code: 'UNAUTHORIZED' }),
  USER_NOT_FOUND: () => new AppError({ statusCode: 404, code: 'USER_NOT_FOUND' }),
  INVALID_CREDENTIALS: () => new AppError({ statusCode: 401, code: 'INVALID_CREDENTIALS' }),
}
