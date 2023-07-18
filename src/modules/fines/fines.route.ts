// TODO: 增加罚款路由
import { FastifyInstance } from 'fastify'
import { payFineHandler, getFineByBorrowIdHandler } from './fines.controller'

async function fineRoutes(server: FastifyInstance) {
	server.post(
		'/',
		{
			schema: {
				tags: ['Fine'],
				body: {
					type: 'object',
					properties: {
						borrowId: { type: 'number' },
					},
					required: ['borrowId'],
				},
			},
		},
		getFineByBorrowIdHandler
	)

	server.put(
		'/:fId',
		{
			schema: {
				tags: ['Fine'],
				params: {
					type: 'object',
					properties: {
						fId: { type: 'number' },
					},
					required: ['fId'],
				},
				body: {
					type: 'object',
					properties: {
						borrowId: { type: 'number' },
					},
					required: ['borrowId'],
				},
			},
		},
		payFineHandler
	)
}

export default fineRoutes
