import { FastifyInstance } from 'fastify'
import {
	getBorrowsHandler,
	deleteBorrowHandler,
	addBorrowHandler,
	renewBorrowHandler,
	getBorrowsByReadIdHandler,
} from './borrows.controller'

async function borrowRoutes(server: FastifyInstance) {
	server.post(
		'/',
		{
			schema: {
				tags: ['Borrow'],
				body: {
					type: 'object',
					properties: {
						bookId: { type: 'number' },
						readerId: { type: 'number' },
					},
					required: ['bookId', 'readerId'],
				},
			},
		},
		addBorrowHandler
	)

	server.delete(
		'/:bId',
		{
			schema: {
				tags: ['Borrow'],
				params: {
					type: 'object',
					properties: {
						bId: { type: 'number' },
					},
					required: ['bId'],
				},
				body: {
					type: 'object',
					properties: {
						readerId: { type: 'number' },
					},
					required: ['readerId'],
				},
			},
		},
		deleteBorrowHandler
	)

	server.get(
		'/',
		{
			schema: {
				tags: ['Borrow'],
				querystring: {
					type: 'object',
					properties: {
						page: { type: 'number' },
					},
				},
			},
		},
		getBorrowsHandler
	)

	server.get(
		'/:rId',
		{
			schema: {
				tags: ['Borrow'],
				params: {
					type: 'object',
					properties: {
						rId: { type: 'number' },
					},
				},
				querystring: {
					type: 'object',
					properties: {
						page: { type: 'number' },
					},
				},
			},
		},
		getBorrowsByReadIdHandler
	)

	server.put(
		'/:bId',
		{
			schema: {
				tags: ['Borrow'],
				params: {
					type: 'object',
					properties: {
						bId: { type: 'number' },
					},
					required: ['bId'],
				},
				body: {
					type: 'object',
					properties: {
						readerId: { type: 'number' },
					},
					required: ['readerId'],
				},
			},
		},
		renewBorrowHandler
	)
}

export default borrowRoutes
