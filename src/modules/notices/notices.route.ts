import { FastifyInstance } from 'fastify'
import {
	addNoticeHandler,
	deleteNoticeHandler,
	updateNoticeHandler,
	getNoticeHandler,
	getNoticeByIdHandler,
	searchNoticeHandler,
} from './notices.controller'

async function noticeRoutes(server: FastifyInstance) {
	server.post(
		'/',
		{
			schema: {
				tags: ['Notice'],
				body: {
					type: 'object',
					properties: {
						title: { type: 'string' },
						content: { type: 'string' },
						creationDate: { type: 'string' },
						userId: { type: 'number' },
					},
					required: ['title', 'content', 'creationDate', 'userId'],
				},
			},
		},
		addNoticeHandler
	)

	server.delete(
		'/:nId',
		{
			schema: {
				tags: ['Notice'],
				params: {
					type: 'object',
					properties: {
						nId: { type: 'number' },
					},
				},
			},
		},
		deleteNoticeHandler
	)

	server.put(
		'/:nId',
		{
			schema: {
				tags: ['Notice'],
				params: {
					type: 'object',
					properties: {
						nId: { type: 'number' },
					},
				},
				body: {
					type: 'object',
					properties: {
						title: { type: 'string' },
						content: { type: 'string' },
					},
					required: ['title', 'content'],
				},
			},
		},
		updateNoticeHandler
	)

	server.get(
		'/',
		{
			schema: {
				tags: ['Notice'],
				querystring: {
					type: 'object',
					properties: {
						page: { type: 'number' },
					},
				},
			},
		},
		getNoticeHandler
	)

	server.get(
		'/:nId',
		{
			schema: {
				tags: ['Notice'],
				params: {
					type: 'object',
					properties: {
						nId: { type: 'number' },
					},
					required: ['nId'],
				},
			},
		},
		getNoticeByIdHandler
	)

	server.get(
		'/search',
		{
			schema: {
				tags: ['Notice'],
				querystring: {
					type: 'object',
					properties: {
						page: { type: 'number' },
						search: { type: 'string' },
					},
				},
			},
		},
		searchNoticeHandler
	)
}

export default noticeRoutes
