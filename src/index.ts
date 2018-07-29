const fastify = require('fastify')()
const PORT = process.env.PORT || 5000
const keys = new Set(['c0366e6f04436200b9998419134e4c3216b08daf'])
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

fastify.listen(PORT, '0.0.0.0', (err) => {
  if (err) throw err
  console.log(`Nimebox Middleware is listening on ${fastify.server.address().port}`)
})
module.exports = fastify
