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
const fastify = require('fastify')()
const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || '0.0.0.0'
const keys = new Set([process.env.API_BEARER_SECRET_TOKEN])
fastify.register(require('fastify-helmet'))
fastify.register(require('fastify-bearer-auth'), {keys}, (err) => {
  if (err) {
    console.error(err.message)
    process.exit(1)
  }
})
const fastifyCaching = require('fastify-caching')

fastify.register(
  fastifyCaching,
  {privacy: fastifyCaching.privacy.NOCACHE},
  (err) => { if (err) throw err }
)

// API Routing
fastify.register(require('./routes/v1/'), { prefix: '/v1' })
fastify.register(require('./routes/v1/anime'), { prefix: '/v1' })
fastify.register(require('./routes/v1/news'), { prefix: '/v1' })

fastify.listen(PORT, HOST, (err) => {
  if (err) throw err
  console.log(`Nimebox Middleware is listening on ${fastify.server.address().port}`)
})
module.exports = fastify
