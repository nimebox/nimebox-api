import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { ServerResponse, IncomingMessage } from 'http'
import senpai from '../../../scrapers/senpai'
import animawka from '../../../scrapers/animawka_old'
import onanime from '../../../scrapers/onanime'

export default async (fastify: FastifyInstance, opts) => {
  fastify.get('/anime', opts, async (req: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {
    reply.header('Content-Type', 'application/json').code(200)
    try {
      let res = null
      switch (req.query.provider) {
        case 'animawka':
          res = await animawka.getAnimes()
          break
        case 'onanime':
          res = await onanime.getAnimes()
          break
        case 'senpai':
        default:
          res = await senpai.getAnimes()
          break
      }
      reply.send(res)
    } catch (err) {
      reply.send(err)
    }
  })
  fastify.get('/anime/:q', opts, async (req: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {
    reply.header('Content-Type', 'application/json').code(200)
    if (req.params === undefined || !req.params.q) {
      reply.send({ error: 'Missing q param' })
    } else {
      try {
        let res = null
        switch (req.query.provider) {
          case 'animawka':
            res = await animawka.getAnime(req.params.q)
            break
          case 'onanime':
            res = await onanime.getAnime(req.params.q)
            break
          case 'senpai':
          default:
            res = await senpai.getAnime(req.params.q)
            break
        }
        reply.send(res)
      } catch (err) {
        reply.send(err)
      }
    }
  })
  fastify.get('/anime/:q/:n', opts, async (req: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {
    reply.header('Content-Type', 'application/json').code(200)
    if (req.params === undefined || !req.params.q || !req.params.n) {
      reply.send({ error: 'Missing q and n param' })
    } else {
      try {
        let res = null
        switch (req.query.provider) {
          case 'animawka':
            res = await animawka.getAnimePlayers(req.params.q, req.params.n)
            break
          case 'onanime':
            res = await onanime.getAnimePlayers(req.params.q, req.params.n)
            break
          case 'senpai':
          default:
            res = await senpai.getAnimePlayers(req.params.q, req.params.n)
            break
        }
        reply.send(res)
      } catch (err) {
        reply.send(err)
      }
    }
  })

  return
}
