import { AuthPayload } from '../../middlewares/authenticate'

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload
    }
  }
}

export {}
