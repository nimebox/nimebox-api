const animenews = require('../../../scrapers/anime24')
module.exports = (fastify, opts, next) => {
  fastify.get('/news', opts, async (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    try {
      const res = await animenews.news()
      reply.send(res)
    } catch (err) {
      reply.send(err)
    }
  })
  next()
}
