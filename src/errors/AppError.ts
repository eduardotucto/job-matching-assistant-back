type AppErrorParams = {
  code: string
  statusCode?: number
}

export class AppError extends Error {
  public readonly code: string
  public readonly statusCode: number

  constructor ({
    code,
    statusCode = 400
  }: AppErrorParams) {
    super(code)

    this.name = 'AppError'

    this.code = code
    this.statusCode = statusCode
  }
}
