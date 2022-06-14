import fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import helmet from 'fastify-helmet'
import ws from 'fastify-websocket'

import { chatRoutes } from './routes/chat.js'

/**
 * @param { import('fastify').FastifyServerOptions } options
 */
export function build(options = {}) {
  const app = fastify(options)

  app.register(helmet)
  app.register(fastifyCors)
  app.register(ws)

  app.get('/', (request, reply) => {
    reply.send({ message: 'welcome on wsf realtime chat' })
  })
  app.register(chatRoutes, { prefix: '/chat' })

  return app
}
