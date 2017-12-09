const senpai = require('../../../scraper/senpai')
module.exports = (fastify, opts, next) => {
  fastify.get('/anime', opts, (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    senpai.animeList().then(el => reply.send(el)).catch(err => reply.send(err))
  })
  next()
}
