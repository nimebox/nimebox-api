import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { ServerResponse, IncomingMessage } from 'http'
import animenews from '../../../scrapers/anime24'

export default async (fastify: FastifyInstance, opts) => {
  fastify.get('/news', opts, async (req: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {
    reply.header('Content-Type', 'application/json').code(200)
    try {
      const res = await animenews()
      reply.send(res)
    } catch (err) {
      reply.send(err)
    }
  })

}
