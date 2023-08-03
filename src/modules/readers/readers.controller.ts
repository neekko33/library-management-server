import prisma from '../../utils/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

type ReaderRequest = FastifyRequest<{
	Params: {
		rId?: number
	}
	Querystring: {
		page?: number
		search?: string
	}
	Body: {
		name: string
		password: string
		phone: string
		email: string
	}
}>

type ReaderResult = {
	ReaderID: number
	Name: string | null
	Phone: string | null
	Email: string | null
}

export async function searchReaderHandler(
	request: ReaderRequest,
	reply: FastifyReply
) {
	try {
		let { search, page } = request.query
		if (!search) return
		if (!page) page = 1
		const total = await prisma.readers.count({
			where: {
				OR: [
					{
						Name: {
							contains: search,
						},
					},
					{
						Phone: {
							contains: search,
						},
					},
					{
						Email: {
							contains: search,
						},
					},
				],
			},
		})
		const readers = await prisma.readers.findMany({
			select: {
				ReaderID: true,
				Name: true,
				Phone: true,
				Email: true,
			},
			where: {
				OR: [
					{
						Name: {
							contains: search,
						},
					},
					{
						Phone: {
							contains: search,
						},
					},
					{
						Email: {
							contains: search,
						},
					},
				],
			},
			take: 13,
			skip: (page - 1) * 13,
		})
		const data: ReaderResult[] = []
		readers.map(item => {
			data.push({
				ReaderID: item.ReaderID,
				Name: item.Name,
				Phone: item.Phone,
				Email: item.Email,
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

export async function getReaderHandler(
	request: ReaderRequest,
	reply: FastifyReply
) {
	try {
		const total = await prisma.readers.count()
		let { page } = request.query
		if (!page) page = 1
		const readers = await prisma.readers.findMany({
			take: 13,
			skip: (page - 1) * 13,
		})
		reply.code(200).send({
			total,
			page,
			data: readers,
		})
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

export async function getReaderByIdHandler(
	request: ReaderRequest,
	reply: FastifyReply
) {
	try {
		const readerId = request.params.rId
		console.log('ReaderID:' + readerId)
		const reader = await prisma.readers.findUnique({
			where: {
				ReaderID: readerId,
			},
		})
		reply.code(200).send({
			data: reader,
		})
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

export async function addReaderHandler(
	request: ReaderRequest,
	reply: FastifyReply
) {
	const { name, phone, email } = request.body
	try {
		await prisma.readers.create({
			data: {
				Name: name,
				Password: phone,
				Phone: phone,
				Email: email,
			},
		})
		reply.code(200).send({ msg: 'success' })
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

export async function updateReaderHandler(
	request: ReaderRequest,
	reply: FastifyReply
) {
	const { rId } = request.params
	if (!rId) reply.code(500).send({ msg: 'need reader id.' })
	const { name, phone, email } = request.body
	try {
		await prisma.readers.update({
			where: {
				ReaderID: rId,
			},
			data: {
				Name: name,
				Phone: phone,
				Email: email,
			},
		})
		reply.code(200).send({ msg: 'success' })
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

export async function deleteReaderHandler(
	request: ReaderRequest,
	reply: FastifyReply
) {
	const { rId } = request.params
	if (!rId) reply.code(500).send({ msg: 'need reader id.' })
	try {
		await prisma.readers.delete({
			where: {
				ReaderID: rId,
			},
		})
		reply.code(200).send({ msg: 'success' })
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}
