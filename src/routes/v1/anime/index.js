const senpai = require('../../../scraper/senpai')
module.exports = (fastify, opts, next) => {
  fastify.get('/anime', opts, async (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    try {
      const res = await senpai.getAnimes()
      reply.send(res)
    } catch (err) {
      reply.send(err)
    }
  })
  fastify.get('/anime/:q', opts, async (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    if (req.params === undefined || !req.params.q) {
      reply.send({error: 'Missing q param'})
    } else {
      try {
        const res = await senpai.getAnime(req.params.q)
        reply.send(res)
      } catch (err) {
        reply.send(err)
      }
    }
  })
  fastify.get('/anime/:q/:n', opts, async (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    if (req.params === undefined || !req.params.q || !req.params.n) {
      reply.send({error: 'Missing q and n param'})
    } else {
      try {
        const res = await senpai.getAnimePlayers(req.params.q, req.params.n)
        reply.send(res)
      } catch (err) {
        reply.send(err)
      }
    }
  })

  /**
   * @deprecated
  */
  // fastify.post('/anime/episodes', opts, (req, reply) => {
  //   reply.header('Content-Type', 'application/json').code(200)
  //   if (req.body === undefined || !req.body.url) {
  //     reply.send({error: 'Missing body param'})
  //   } else {
  //     senpai.episodes(req.body.url).then(el => reply.send(el)).catch(err => reply.send(err))
  //   }
  // })
  // fastify.post('/anime/episodes/players', opts, (req, reply) => {
  //   reply.header('Content-Type', 'application/json').code(200)
  //   if (req.body === undefined || !req.body.url) {
  //     reply.send({error: 'Missing body param'})
  //   } else {
  //     senpai.players(req.body.url).then(el => reply.send(el)).catch(err => reply.send(err))
  //   }
  // })

  next()
}
