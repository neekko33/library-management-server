import { FastifyInstance } from 'fastify'
import {
	addUserHandler,
	deleteUserHandler,
	updateUserHandler,
	getUserHandler,
	loginHandler,
	getUserByIdHandler,
	searchUserHandler,
} from './users.controller'

async function userRoutes(server: FastifyInstance) {
	server.post(
		'/login',
		{
			schema: {
				tags: ['User'],
				body: {
					type: 'object',
					properties: {
						username: { type: 'string' },
						password: { type: 'string' },
					},
					required: ['username', 'password'],
				},
			},
		},
		loginHandler
	)

	server.post(
		'/',
		{
			schema: {
				tags: ['User'],
				body: {
					type: 'object',
					properties: {
						username: { type: 'string' },
						userType: { type: 'string' },
					},
					required: ['username', 'userType'],
				},
			},
		},
		addUserHandler
	)

	server.delete(
		'/:uId',
		{
			schema: {
				tags: ['User'],
				params: {
					type: 'object',
					properties: {
						uId: { type: 'number' },
					},
					required: ['uId'],
				},
			},
		},
		deleteUserHandler
	)

	server.put(
		'/:uId',
		{
			schema: {
				tags: ['User'],
				params: {
					type: 'object',
					properties: {
						uId: { type: 'number' },
					},
					required: ['uId'],
				},
				body: {
					type: 'object',
					properties: {
						username: { type: 'string' },
						userType: { type: 'string' },
					},
					required: ['username', 'userType'],
				},
			},
		},
		updateUserHandler
	)

	server.get(
		'/',
		{
			schema: {
				tags: ['User'],
				querystring: {
					type: 'object',
					properties: {
						page: { type: 'number' },
					},
				},
			},
		},
		getUserHandler
	)

	server.get(
		'/:uId',
		{
			schema: {
				tags: ['User'],
				params: {
					type: 'object',
					properties: {
						uId: { type: 'number' },
					},
					required: ['uId'],
				},
			},
		},
		getUserByIdHandler
	)

	server.get(
		'/search',
		{
			schema: {
				tags: ['User'],
				querystring: {
					type: 'object',
					properties: {
						page: { type: 'number' },
						search: { type: 'string' },
					},
				},
			},
		},
		searchUserHandler
	)
}

export default userRoutes
