import Fastify, {FastifyInstance} from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import bookRoutes from './modules/books/books.route'
import categoryRoutes from './modules/categories/categories.route'
import userRoutes from './modules/users/users.route'
import readerRoutes from './modules/readers/readers.route'

const server: FastifyInstance = Fastify({})

const swaggerOptions = {
  swagger: {
    info: {
      title: 'My Title',
      description: 'My Description.',
      version: '1.0.0',
    },
    host: 'localhost',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [{name: 'Default', description: 'Default'}],
  }
}

const swaggerUiOptions = {
  routePrefix: '/docs',
  exposeRoute: true,
}

server.register(fastifySwagger, swaggerOptions)
server.register(fastifySwaggerUi, swaggerUiOptions)

server.register(bookRoutes, {prefix: 'api/books'})
server.register(categoryRoutes, {prefix: 'api/categories'})
server.register(userRoutes, {prefix: 'api/users'})
server.register(readerRoutes, {prefix: 'api/readers'})

const start = async () => {
  try {
    await server.listen({port: 3000})
  } catch (e) {
    server.log.error(e)
    process.exit(1)
  }
}

start()
