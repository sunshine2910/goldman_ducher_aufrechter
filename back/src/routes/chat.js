import { randomUUID } from 'crypto'

/**
 * @typedef {Object} Message
 * @property {string} id - an uuid
 * @property {Date} sentAt - date the mesage was sent
 * @property {string} message - sender pseudo
 * @property {string} user - body of the message
 */

/** @type { Message[] } */
const messages = []

/**
 * @param {string} user
 * @param {string} message
 */
function handleNewMessage(user, message) {
  const msg = {
    id: randomUUID(),
    sentAt: new Date(),
    user,
    message,
  }
  messages.push(msg)
  return msg
}

/**
 * @type { import('fastify').FastifyPluginCallback }
 */
export async function chatRoutes(app) {
  /**
   * @param {{ type: string, payload: object }} data
   */
  function broadcast(data) {
    app.websocketServer.clients.forEach((client) => {
      client.send(JSON.stringify(data))
    })
  }

  app.get('/', { websocket: true }, (connection, req) => {
    connection.socket.on('message', (message) => {
      const data = JSON.parse(message.toString('utf-8'))
      broadcast({
        type: 'NEW_MESSAGE',
        payload: handleNewMessage(data.user, data.message),
      })
    })
  })

  app.get('/history', (request, reply) => {
    reply.send(messages.slice(-30))
  })
}
