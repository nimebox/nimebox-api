import dotenv from 'dotenv-safe'
let envConfig = {}
if (process.env.NODE_ENV === 'production') {
  envConfig = { path: './.env.production' }
} else if (process.env.NODE_ENV === 'test') {
  envConfig = { path: './.env.test' }
} else {
  envConfig = { path: './.env' }
}
dotenv.config(Object.assign({}, { allowEmptyValues: true, example: './.env.example' }, envConfig))
import fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import helmet from 'fastify-helmet'
import compress from 'fastify-compress'
import bearer from 'fastify-bearer-auth'
import circuitBreaker from 'fastify-circuit-breaker'
import cors from 'cors'
import index from './routes/v1'
import news from './routes/v1/news'
import anime from './routes/v1/anime'

const PORT = Number(process.env.PORT) || 5000
const HOST = process.env.HOST || '0.0.0.0'
const keys = new Set([process.env.API_BEARER_SECRET_TOKEN])

const app: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify()
app.register(circuitBreaker, {
  threshold: 5,
  timeout: 15000,
  resetTimeout: 15000,
})
app.register(helmet)
app.register(compress)
app.register(bearer, { keys })
app.use(cors())

// API Routing
app.register(index, { prefix: '/v1' })
app.register(anime, { prefix: '/v1' })
app.register(news, { prefix: '/v1' })

app.listen(PORT, HOST, (err) => {
  if (err) throw err
  // @ts-ignore
  console.log(`Nimebox api is listening on ${app.server.address().address}:${app.server.address().port}`)
})

export default () => app
