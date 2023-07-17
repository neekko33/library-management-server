import prisma from '../../utils/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

type BorrowRequest = FastifyRequest<{
	Params: {
		bId?: number
	}
	Querystring: {
		page?: number
	}
	Body: {
		bookId: number
		readerId: number
	}
}>

export async function getBorrowsHandler(
	request: BorrowRequest,
	reply: FastifyReply
) {
	try {
		const total = await prisma.borrows.count()
		let { page } = request.query
		if (!page) page = 1
		const borrows = await prisma.borrows.findMany()
		reply.code(200).send({
			total,
			page,
			data: borrows,
		})
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

export async function addBorrowHandler(
	request: BorrowRequest,
	reply: FastifyReply
) {
	const { bookId, readerId } = request.body
	const borrowDate = new Date(new Date().toLocaleDateString())
	const returnDate = new Date(new Date().setMonth(new Date().getMonth() - 1))
	try {
		await prisma.borrows.create({
			data: {
				BookID: bookId,
				ReaderID: readerId,
				BorrowDate: borrowDate,
				ReturnDate: returnDate,
			},
		})
		reply.code(200).send({ msg: 'success' })
	} catch (e) {
		reply.code(500).send({ mgs: e })
	}
}

export async function deleteBorrowHandler(
	request: BorrowRequest,
	reply: FastifyReply
) {
	const { bId } = request.params
	if (!bId) reply.code(500).send({ msg: 'need borrow id.' })
	try {
		await prisma.borrows.delete({
			where: {
				BorrowID: bId,
			},
		})
		reply.code(200).send({ msg: 'success' })
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

// TODO: 续借图书

// TODO: 判断是否逾期
