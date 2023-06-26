import Fastify, {FastifyInstance} from 'fastify'
import bookRoutes from './modules/books/books.route'
import categoryRoutes from './modules/categories/categories.route'

const server: FastifyInstance = Fastify({})
server.register(bookRoutes, {prefix: 'api/books'})
server.register(categoryRoutes, {prefix: 'api/categories'})
const start = async () => {
  try {
    await server.listen({port: 3000})
  } catch (e) {
    server.log.error(e)
    process.exit(1)
  }
}

start()
