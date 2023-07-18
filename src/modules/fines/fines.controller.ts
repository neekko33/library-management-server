import prisma from '../../utils/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

type FineRequest = FastifyRequest<{
	Params: {
		fId?: number
	}
	Querystring: {
		page?: number
	}
	Body: {
		borrowId?: number
	}
}>

export async function getFineByBorrowIdHandler(
	request: FineRequest,
	reply: FastifyReply
) {
	try {
		const fine = await prisma.fines.findFirst({
			where: {
				BorrowID: request.body.borrowId,
			},
		})
		reply.code(200).send({
			data: fine,
		})
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

export async function payFineHandler(
	request: FineRequest,
	reply: FastifyReply
) {
	try {
		await prisma.fines.update({
			where: {
				FineID: request.params.fId,
			},
			data: {
				IsPaid: true,
			},
		})
		await prisma.borrows.update({
			where: {
				BorrowID: request.body.borrowId,
			},
			data: {
				BorrowDate: new Date(),
				IsOverdue: false,
			},
		})
		reply.code(200).send({ msg: 'success' })
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}
