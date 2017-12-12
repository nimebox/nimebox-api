const senpai = require('../../../scraper/senpai')
module.exports = (fastify, opts, next) => {
  fastify.get('/anime', opts, (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    senpai.animeList().then(el => reply.send(el)).catch(err => reply.send(err))
  })
  fastify.post('/anime/episodes', opts, (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    if (req.body === undefined || !req.body.url) {
      reply.send({error: 'Missing body param'})
    } else {
      senpai.episodes(req.body.url).then(el => reply.send(el)).catch(err => reply.send(err))
    }
  })
  fastify.post('/anime/episodes/players', opts, (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    if (req.body === undefined || !req.body.url) {
      reply.send({error: 'Missing body param'})
    } else {
      senpai.players(req.body.url).then(el => reply.send(el)).catch(err => reply.send(err))
    }
  })
  next()
}
