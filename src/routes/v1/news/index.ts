import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { ServerResponse, IncomingMessage } from 'http'
import Anime24 from '../../../scrapers/Anime24'

const animeNews = new Anime24()

export default async (fastify: FastifyInstance, opts) => {
  fastify.get('/news', opts, async (req: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {
    reply.header('Content-Type', 'application/json').code(200)
    try {
      const res = await animeNews.getNews()
      return {
        data: res,
      }
    } catch (err) {
      throw err
    }
  })

}
