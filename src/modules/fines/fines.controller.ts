import prisma from '../../utils/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

type FineRequest = FastifyRequest<{
	Params: {
		fId?: number
	}
	Querystring: {
		page?: number
	}
	Body: {}
}>
