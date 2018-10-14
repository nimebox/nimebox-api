import { FastifyInstance } from 'fastify'

export default async (fastify: FastifyInstance, opts) => {
  fastify.get('/', opts, (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    reply.send({ message: `Api say Hello` })
  })
}
