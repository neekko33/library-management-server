import prisma from '../../utils/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

type UserRequest = FastifyRequest<{
	Params: {
		uId?: number
	}
	Querystring: {
		page?: number
		search?: string
	}
	Body: {
		username: string
		password: string
		userType: string
	}
}>

export async function loginHandler(request: UserRequest, reply: FastifyReply) {
	try {
		const { username, password } = request.body
		const user = await prisma.users.findFirst({
			where: {
				Username: username,
				Password: password,
			},
		})
		if (user) {
			reply.code(200).send({
				msg: '登录成功',
				userId: user.UserID,
				username: user.Username,
				userType: user.UserType,
			})
		} else {
			reply.code(500).send({ mgs: '用户名或密码错误' })
		}
	} catch (e) {
		reply.code(500).send({ mgs: e })
	}
}

export async function searchUserHandler(
	request: UserRequest,
	reply: FastifyReply
) {
	try {
		let { search, page } = request.query
		if (!search) return
		if (!page) page = 1
		const total = await prisma.users.count({
			where: {
				Username: {
					contains: search,
				},
			},
		})
		const users = await prisma.users.findMany({
			select: {
				UserID: true,
				Username: true,
				UserType: true,
			},
			where: {
				Username: {
					contains: search,
				},
			},
			take: 13,
			skip: (page - 1) * 13,
		})
		reply.code(200).send({
			total,
			page,
			data: users,
		})
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

export async function getUserHandler(
	request: UserRequest,
	reply: FastifyReply
) {
	try {
		const total = await prisma.users.count()
		let { page } = request.query
		if (!page) page = 1
		const users = await prisma.users.findMany({
			select: {
				UserID: true,
				Username: true,
				UserType: true,
			},
			take: 13,
			skip: (page - 1) * 13,
		})
		reply.code(200).send({
			total,
			page,
			data: users,
		})
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

export async function getUserByIdHandler(
	request: UserRequest,
	reply: FastifyReply
) {
	try {
		const userId = request.params.uId
		const user = await prisma.users.findUnique({
			select: {
				UserID: true,
				Username: true,
				UserType: true,
			},
			where: {
				UserID: userId,
			},
		})
		reply.code(200).send({
			data: user,
		})
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

export async function addUserHandler(
	request: UserRequest,
	reply: FastifyReply
) {
	const { username, userType } = request.body
	try {
		await prisma.users.create({
			data: {
				Username: username,
				Password: '123456',
				UserType: userType,
			},
		})
		reply.code(200).send({ msg: 'success' })
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

export async function updateUserHandler(
	request: UserRequest,
	reply: FastifyReply
) {
	const { uId } = request.params
	if (!uId) reply.code(500).send({ msg: 'need users id.' })
	const { username, userType } = request.body
	try {
		await prisma.users.update({
			where: {
				UserID: uId,
			},
			data: {
				Username: username,
				UserType: userType,
			},
		})
		reply.code(200).send({ msg: 'success' })
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

export async function deleteUserHandler(
	request: UserRequest,
	reply: FastifyReply
) {
	const { uId } = request.params
	if (!uId) reply.code(500).send({ msg: 'need users id.' })
	try {
		await prisma.users.delete({
			where: {
				UserID: uId,
			},
		})
		reply.code(200).send({ msg: 'success' })
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}
