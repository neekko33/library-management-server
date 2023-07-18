import { FastifyInstance } from 'fastify'
import {
	addReaderHandler,
	deleteReaderHandler,
	updateReaderHandler,
	getReaderHandler,
} from './readers.controller'

async function readerRoutes(server: FastifyInstance) {
	server.post(
		'/',
		{
			schema: {
				tags: ['Reader'],
				body: {
					type: 'object',
					properties: {
						name: { type: 'string' },
						password: { type: 'string' },
						phone: { type: 'string' },
						email: { type: 'string' },
					},
					required: ['name', 'password', 'phone', 'email'],
				},
			},
		},
		addReaderHandler
	)

	server.delete(
		'/:rId',
		{
			schema: {
				tags: ['Reader'],
				params: {
					type: 'object',
					properties: {
						rId: { type: 'number' },
					},
				},
			},
		},
		deleteReaderHandler
	)

	server.put(
		'/:rId',
		{
			schema: {
				tags: ['Reader'],
				params: {
					type: 'object',
					properties: {
						rId: { type: 'number' },
					},
				},
				body: {
					type: 'object',
					properties: {
						name: { type: 'string' },
						password: { type: 'string' },
						contactInformation: { type: 'string' },
					},
					required: ['name', 'password', 'contactInformation'],
				},
			},
		},
		updateReaderHandler
	)

	server.get(
		'/',
		{
			schema: {
				tags: ['Reader'],
				querystring: {
					type: 'object',
					properties: {
						page: { type: 'number' },
					},
				},
			},
		},
		getReaderHandler
	)
}

export default readerRoutes
