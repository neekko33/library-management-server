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

export async function getFinesHandler(
	request: FineRequest,
	reply: FastifyReply
) {
	try {
		const total = await prisma.borrows.count()
		let { page } = request.query
		if (!page) page = 1
		const fines = await prisma.fines.findMany({
			take: 13,
			skip: (page - 1) * 13,
		})
		reply.code(200).send({
			total,
			page,
			data: fines,
		})
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

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
		reply.code(200).send({ msg: '操作成功' })
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}
