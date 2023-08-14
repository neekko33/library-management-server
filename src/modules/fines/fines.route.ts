// TODO: 增加罚款路由
import { FastifyInstance } from 'fastify'
import {
	payFineHandler,
	getFineByBorrowIdHandler,
	getFinesHandler,
} from './fines.controller'

async function fineRoutes(server: FastifyInstance) {
	server.get(
		'/',
		{
			schema: {
				tags: ['Fine'],
				querystring: {
					type: 'object',
					properties: {
						page: { type: 'number' },
					},
				},
			},
		},
		getFinesHandler
	)

	server.get(
		'/:bId',
		{
			schema: {
				tags: ['Fine'],
				querystring: {
					type: 'object',
					properties: {
						page: { type: 'number' },
					},
				},
				params: {
					type: 'object',
					properties: {
						bId: { type: 'number' },
					},
					required: ['bId'],
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
			},
		},
		payFineHandler
	)
}

export default fineRoutes
