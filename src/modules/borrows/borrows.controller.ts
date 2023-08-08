import prisma from '../../utils/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

type BorrowRequest = FastifyRequest<{
	Params: {
		bId?: number
		rId?: number
	}
	Querystring: {
		page?: number
	}
	Body: {
		bookId: number
		readerId: number
	}
}>

type BorrowResult = {
	BorrowID: number
	BookName: string | null
	BookID: number
	ReaderName: string | null
	ReaderID: number
	BorrowDate: object
	DueDate: object | null
	ReturnDate: object | null
	IsOverdue: boolean
}

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
		const borrows = await prisma.borrows.findMany({
			take: 13,
			skip: (page - 1) * 13,
			include: {
				Readers: {
					select: {
						Name: true,
					},
				},
				Books: {
					select: {
						Title: true,
					},
				},
			},
		})
		const data: BorrowResult[] = []
		borrows.map(item => {
			data.push({
				BorrowID: item.BorrowID,
				BookName: item.Books.Title,
				BookID: item.BookID,
				ReaderName: item.Readers.Name,
				ReaderID: item.ReaderID,
				BorrowDate: item.BorrowDate,
				DueDate: item.DueDate,
				ReturnDate: item.ReturnDate,
				IsOverdue: item.IsOverdue,
			})
		})
		reply.code(200).send({
			total,
			page,
			data,
		})
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

export async function getBorrowsByReadIdHandler(
	request: BorrowRequest,
	reply: FastifyReply
) {
	try {
		const { rId } = request.params
		const total = await prisma.borrows.count({
			where: {
				ReaderID: rId,
			},
		})
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
	const borrowDate = new Date()
	try {
		await prisma.borrows.create({
			data: {
				BookID: bookId,
				ReaderID: readerId,
				BorrowDate: borrowDate,
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
	const returnDate = new Date()
	try {
		await prisma.borrows.update({
			where: {
				BorrowID: bId,
			},
			data: {
				ReturnDate: returnDate,
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
	const borrowDate = new Date()
	try {
		await prisma.borrows.update({
			where: {
				BorrowID: bId,
			},
			data: {
				BorrowDate: borrowDate,
			},
		})
		reply.code(200).send({ mgs: 'success' })
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

// 判断是否逾期
export async function checkOverdueAll() {
	try {
		const borrows = await prisma.borrows.findMany({
			where: {
				IsOverdue: false,
			},
		})
		const overdueBorrowIds: number[] = []
		borrows.map(item => {
			const days =
				(new Date().getTime() - item.BorrowDate.getTime()) /
				(1000 * 60 * 60 * 24)
			if (days >= 31) {
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
			// 生成罚款记录
			await prisma.fines.create({
				data: {
					BorrowID: item,
					FineAmount: 5,
					IsPaid: false,
				},
			})
		})
	} catch (e) {
		console.log(e)
	}
}
