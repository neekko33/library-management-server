import { FastifyInstance } from 'fastify'
import {
	addBookHandler,
	deleteBookHandler,
	updateBookHandler,
	getBooksHandler,
	searchBooksHandler,
} from './books.controller'

async function bookRoutes(server: FastifyInstance) {
	server.post(
		'/',
		{
			schema: {
				tags: ['Book'],
				body: {
					type: 'object',
					properties: {
						id: { type: 'number' },
						title: { type: 'string' },
						author: { type: 'string' },
						publicationDate: { type: 'string' },
						publishingHouse: { type: 'string' },
						isbn: { type: 'string' },
						price: { type: 'string' },
						categoryId: { type: 'number' },
						availabilityStatus: { type: 'string' },
						location: { type: 'string' },
						ImgUrl: { type: 'string' },
						Introduction: { type: 'string' },
					},
					required: [
						'bookId',
						'title',
						'author',
						'publicationDate',
						'publishingHouse',
						'isbn',
						'price',
						'categoryId',
						'availabilityStatus',
						'location',
						'imgUrl',
						'introduction',
					],
				},
			},
		},
		addBookHandler
	)

	server.delete(
		'/:bookId',
		{
			schema: {
				tags: ['Book'],
				params: {
					type: 'object',
					properties: {
						bookId: { type: 'number' },
					},
				},
			},
		},
		deleteBookHandler
	)

	server.put(
		'/:bookId',
		{
			schema: {
				tags: ['Book'],
				params: {
					type: 'object',
					properties: {
						bookId: { type: 'number' },
					},
				},
				body: {
					type: 'object',
					properties: {
						id: { type: 'number' },
						title: { type: 'string' },
						author: { type: 'string' },
						publicationDate: { type: 'string' },
						publishingHouse: { type: 'string' },
						isbn: { type: 'string' },
						price: { type: 'string' },
						categoryId: { type: 'number' },
						availabilityStatus: { type: 'string' },
						location: { type: 'string' },
						ImgUrl: { type: 'string' },
						Introduction: { type: 'string' },
					},
				},
			},
		},
		updateBookHandler
	)

	server.get(
		'/',
		{
			schema: {
				tags: ['Book'],
				querystring: {
					type: 'object',
					properties: {
						page: { type: 'number' },
					},
				},
			},
		},
		getBooksHandler
	)

	server.get(
		'/search',
		{
			schema: {
				tags: ['Book'],
				querystring: {
					type: 'object',
					properties: {
						page: { type: 'number' },
						search: { type: 'string' },
					},
				},
			},
		},
		searchBooksHandler
	)
}

export default bookRoutes
