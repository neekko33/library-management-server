import { FastifyInstance } from 'fastify'
import {
	addCategoryHandler,
	deleteCategoryHandler,
	updateCategoryHandler,
	getCategoriesHandler,
} from './categories.controller'

async function categoryRoutes(server: FastifyInstance) {
	server.post(
		'/',
		{
			schema: {
				tags: ['Category'],
				body: {
					type: 'object',
					properties: {
						categoryName: { type: 'string' },
						categoryChar: { type: 'string' },
					},
					required: ['categoryName', 'categoryChar'],
				},
			},
		},
		addCategoryHandler
	)

	server.delete(
		'/:cId',
		{
			schema: {
				tags: ['Category'],
				params: {
					type: 'object',
					properties: {
						cId: { type: 'number' },
					},
					required: ['cId'],
				},
			},
		},
		deleteCategoryHandler
	)

	server.put(
		'/:cId',
		{
			schema: {
				tags: ['Category'],
				params: {
					type: 'object',
					properties: {
						cId: { type: 'number' },
					},
					required: ['cId'],
				},
				body: {
					type: 'object',
					properties: {
						categoryName: { type: 'string' },
						categoryChar: { type: 'string' },
					},
					required: ['categoryName', 'categoryChar'],
				},
			},
		},
		updateCategoryHandler
	)

	server.get(
		'/',
		{
			schema: {
				tags: ['Category'],
				querystring: {
					type: 'object',
					properties: {
						page: { type: 'number' },
					},
				},
			},
		},
		getCategoriesHandler
	)
}

export default categoryRoutes
