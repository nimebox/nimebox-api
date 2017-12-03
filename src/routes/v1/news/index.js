const animenews = require('../../../scraper/anime24')
module.exports = function (fastify, opts, next) {
  fastify.get('/news', opts, (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    animenews.news().then(el => reply.send(el)).catch(err => reply.send(err))
  })
  next()
}
