import prisma from '../../utils/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

type ReaderRequest = FastifyRequest<{
	Params: {
		rId?: number
	}
	Querystring: {
		page?: number
	}
	Body: {
		name: string
		password: string
		phone: string
		email: string
	}
}>

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

export async function addReaderHandler(
	request: ReaderRequest,
	reply: FastifyReply
) {
	const { name, password, phone, email } = request.body
	try {
		await prisma.readers.create({
			data: {
				Name: name,
				Password: password,
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
	const { name, password, phone, email } = request.body
	try {
		await prisma.readers.update({
			where: {
				ReaderID: rId,
			},
			data: {
				Name: name,
				Password: password,
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
