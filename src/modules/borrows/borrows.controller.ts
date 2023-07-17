import { read } from 'fs'
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

async function checkOverdueByReaderId(readerId: number, reply: FastifyReply) {
	try {
		const overdueCount = await prisma.borrows.count({
			where: {
				ReaderID: readerId,
				IsOverdue: true,
			},
		})
		if (overdueCount > 0)
			reply.code(500).send({ msg: '有未结清罚款的逾期图书，请结清后重试' })
	} catch (e) {
		reply.code(500).send({ mgs: e })
	}
}

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
	await checkOverdueByReaderId(readerId, reply)
	const dateNow = new Date()
	const borrowDate = new Date(dateNow.toLocaleDateString())
	const returnDate = new Date(
		dateNow.setDate(dateNow.getDate() + 30).toLocaleString()
	)
	try {
		await prisma.borrows.create({
			data: {
				BookID: bookId,
				ReaderID: readerId,
				BorrowDate: borrowDate,
				ReturnDate: returnDate,
				IsOverdue: false,
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
	const { readerId } = request.body
	await checkOverdueByReaderId(readerId, reply)
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

// 续借图书
export async function renewBorrowHandler(
	request: BorrowRequest,
	reply: FastifyReply
) {
	const { bId } = request.params
	if (!bId) reply.code(500).send({ msg: 'need borrow id.' })
	const { readerId } = request.body
	await checkOverdueByReaderId(readerId, reply)
	const dateNow = new Date()
	const returnDate = new Date(
		dateNow.setDate(dateNow.getDate() + 30).toLocaleString()
	)
	try {
		await prisma.borrows.update({
			where: {
				BorrowID: bId,
			},
			data: {
				ReturnDate: returnDate,
			},
		})
		reply.code(200).send({ mgs: 'success' })
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

// TODO: 判断是否逾期
export async function checkOverdueAll() {
	try {
		const borrows = await prisma.borrows.findMany()
		const overdueBorrowIds: number[] = []
		borrows.map(item => {
			const days =
				(item.ReturnDate.getTime() - item.BorrowDate.getTime()) /
				(1000 * 60 * 60 * 24)
			if (days > 30) {
				overdueBorrowIds.push(item.BorrowID)
			}
		})
		if (overdueBorrowIds.length == 0) return
		overdueBorrowIds.map(async item => {
			await prisma.borrows.update({
				where: {
					BorrowID: item,
				},
				data: {
					IsOverdue: true,
				},
			})
		})
	} catch (e) {
		console.log(e)
	}
}
