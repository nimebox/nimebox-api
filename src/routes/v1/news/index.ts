import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { ServerResponse, IncomingMessage } from 'http'

export default async (fastify: FastifyInstance, opts) => {
  fastify.get('/news', opts, async (req: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {
    reply.header('Content-Type', 'application/json').code(200)
    try {
      const res = {}
      return {
        serviceId: 'animeNews.serviceId',
        data: res
      }
    } catch (err) {
      throw err
    }
  })
}
