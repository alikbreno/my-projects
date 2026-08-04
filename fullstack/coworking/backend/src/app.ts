import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import { openapiSpec } from './docs/openapi'
import { errorHandler } from './middlewares/errorHandler'
import { authRoutes } from './modules/auth/auth.routes'
import { reservasRoutes } from './modules/reservas/reservas.routes'
import { salasRoutes } from './modules/salas/salas.routes'
import { usuariosRoutes } from './modules/usuarios/usuarios.routes'

export const app = express()

// contentSecurityPolicy desabilitado porque o Swagger UI (rota /docs)
// depende de script inline pra se montar, e o CSP padrão do helmet
// bloqueia isso. Se quiser manter CSP estrito nas rotas da API "de
// verdade", dá pra aplicar helmet() normal nelas e um helmet mais
// permissivo só na rota /docs.
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// Documentação interativa em /docs (Swagger UI)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec))

app.use('/auth', authRoutes)
app.use('/usuarios', usuariosRoutes)
app.use('/salas', salasRoutes)
app.use('/reservas', reservasRoutes)

app.use((_req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' })
})

// Sempre por último: é o que captura os erros lançados/encaminhados
// pelos controllers e middlewares acima.
app.use(errorHandler)
