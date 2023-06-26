import Fastify, {FastifyInstance } from 'fastify'
import bookRoutes from './modules/books/book.route'

const server: FastifyInstance = Fastify({})
server.register(bookRoutes, { prefix: "api/books" });

const start = async () => {
  try {
    await server.listen({port: 3000})
  } catch (e) {
    server.log.error(e)
    process.exit(1)
  }
}

start()
