import Fastify, { FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import bookRoutes from './modules/books/books.route'
import categoryRoutes from './modules/categories/categories.route'
import userRoutes from './modules/users/users.route'
import readerRoutes from './modules/readers/readers.route'
import noticeRoutes from './modules/notices/notices.route'
import borrowRoutes from './modules/borrows/borrows.route'
import fineRoutes from './modules/fines/fines.route'
import { checkOverdueAll } from './modules/borrows/borrows.controller'

const server: FastifyInstance = Fastify({})

const swaggerOptions = {
	swagger: {
		info: {
			title: 'Library Management System',
			description: 'My Description.',
			version: '1.0.0',
		},
		host: 'localhost:3000',
		schemes: ['http'],
		consumes: ['application/json'],
		produces: ['application/json'],
	},
}

const swaggerUiOptions = {
	routePrefix: '/docs',
	exposeRoute: true,
}

server.register(fastifySwagger, swaggerOptions)
server.register(fastifySwaggerUi, swaggerUiOptions)
// TODO: 新增service层，提取controller中的数据库操作逻辑
server.register(bookRoutes, { prefix: 'api/books' })
server.register(categoryRoutes, { prefix: 'api/categories' })
server.register(userRoutes, { prefix: 'api/users' })
server.register(readerRoutes, { prefix: 'api/readers' })
server.register(noticeRoutes, { prefix: 'api/notices' })
server.register(borrowRoutes, { prefix: 'api/borrows' })
server.register(fineRoutes, { prefix: '/api/fines' })

const start = async () => {
	try {
		await server.listen({ port: 7001 })
	} catch (e) {
		server.log.error(e)
		process.exit(1)
	}
}

checkOverdueAll()

start()
