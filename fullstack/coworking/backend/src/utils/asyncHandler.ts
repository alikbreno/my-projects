import { NextFunction, Request, Response } from 'express'

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>

// Express 4 não captura rejeições de Promise automaticamente dentro de
// rotas async — esse wrapper evita repetir try/catch em cada controller.
export function asyncHandler(fn: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}
