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
		'/:borrowId',
		{
			schema: {
				tags: ['Borrow'],
				params: {
					type: 'object',
					properties: {
						borrowId: { type: 'number' },
					},
					required: ['borrowId'],
				},
				body: {
					type: 'object',
					properties: {
						readerId: { type: 'number' },
					},
					required: ['borrowId'],
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
		'/:readerId',
		{
			schema: {
				tags: ['Borrow'],
				params: {
					type: 'object',
					properties: {
						readerId: { type: 'number' },
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
		'/',
		{
			schema: {
				tags: ['Borrow'],
				params: {
					type: 'object',
					properties: {
						borrowId: { type: 'number' },
					},
					required: ['borrowId'],
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
