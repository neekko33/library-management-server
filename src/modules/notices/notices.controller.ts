import prisma from '../../utils/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

type NoticeRequest = FastifyRequest<{
	Params: {
		nId?: number
	}
	Querystring: {
		page?: number
		search?: string
	}
	Body: {
		title: string
		content: string
		creationDate: Date
		userId: number
	}
}>

type NoticeResult = {
	NoticeID: number
	Title: string
	CreationDate: object
	Author: string | null
}

export async function searchNoticeHandler(
	request: NoticeRequest,
	reply: FastifyReply
) {
	try {
		let { search, page } = request.query
		if (!search) return
		if (!page) page = 1
		const total = await prisma.notices.count({
			where: {
				OR: [
					{
						Title: {
							contains: search,
						},
					},
				],
			},
		})
		const notices = await prisma.notices.findMany({
			where: {
				OR: [
					{
						Title: {
							contains: search,
						},
					},
				],
			},
			include: {
				Users: {
					select: {
						Username: true,
					},
				},
			},
			take: 13,
			skip: (page - 1) * 13,
		})
		const data: NoticeResult[] = []
		notices.map(item => {
			data.push({
				NoticeID: item.NoticeID,
				Title: item.Title,
				CreationDate: item.CreationDate,
				Author: item.Users.Username,
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

export async function getNoticeHandler(
	request: NoticeRequest,
	reply: FastifyReply
) {
	try {
		const total = await prisma.notices.count()
		let { page } = request.query
		if (!page) page = 1
		const notices = await prisma.notices.findMany({
			take: 13,
			skip: (page - 1) * 13,
			include: {
				Users: {
					select: {
						Username: true,
					},
				},
			},
		})
		const data: NoticeResult[] = []
		notices.map(item => {
			data.push({
				NoticeID: item.NoticeID,
				Title: item.Title,
				CreationDate: item.CreationDate,
				Author: item.Users.Username,
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

export async function getNoticeByIdHandler(
	request: NoticeRequest,
	reply: FastifyReply
) {
	try {
		const noticeId = request.params.nId
		const reader = await prisma.notices.findUnique({
			select: {
				NoticeID: true,
				Title: true,
				CreationDate: true,
				Content: true,
			},
			where: {
				NoticeID: noticeId,
			},
		})
		reply.code(200).send({
			data: reader,
		})
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

export async function addNoticeHandler(
	request: NoticeRequest,
	reply: FastifyReply
) {
	const { title, content, creationDate, userId } = request.body
	try {
		await prisma.notices.create({
			data: {
				Title: title,
				Content: content,
				CreationDate: creationDate,
				UserID: userId,
			},
		})
		reply.code(200).send({ msg: '操作成功' })
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

export async function updateNoticeHandler(
	request: NoticeRequest,
	reply: FastifyReply
) {
	const { nId } = request.params
	if (!nId) reply.code(500).send({ msg: 'ID格式错误，请重新操作' })
	const { title, content } = request.body
	try {
		await prisma.notices.update({
			where: {
				NoticeID: nId,
			},
			data: {
				Title: title,
				Content: content,
			},
		})
		reply.code(200).send({ msg: '操作成功' })
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

export async function deleteNoticeHandler(
	request: NoticeRequest,
	reply: FastifyReply
) {
	const { nId } = request.params
	if (!nId) reply.code(500).send({ msg: 'ID格式错误，请重新操作' })
	try {
		await prisma.notices.delete({
			where: {
				NoticeID: nId,
			},
		})
		reply.code(200).send({ msg: '操作成功' })
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}
