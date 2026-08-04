// Erro "esperado" da aplicação (regra de negócio, validação, etc).
// O errorHandler sabe transformar isso numa resposta HTTP adequada;
// qualquer outro erro não tratado vira 500 genérico.
export class AppError extends Error {
  public readonly statusCode: number
  public readonly details?: unknown

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message)
    this.statusCode = statusCode
    this.details = details
    Object.setPrototypeOf(this, AppError.prototype)
  }
}
