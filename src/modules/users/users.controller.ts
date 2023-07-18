import prisma from '../../utils/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

type UserRequest = FastifyRequest<{
	Params: {
		uId?: number
	}
	Querystring: {
		page?: number
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

export async function getUserHandler(
	request: UserRequest,
	reply: FastifyReply
) {
	try {
		const total = await prisma.users.count()
		let { page } = request.query
		if (!page) page = 1
		const categories = await prisma.users.findMany()
		reply.code(200).send({
			total,
			page,
			data: categories,
		})
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

export async function addUserHandler(
	request: UserRequest,
	reply: FastifyReply
) {
	const { username, password, userType } = request.body
	try {
		await prisma.users.create({
			data: {
				Username: username,
				Password: password,
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
	const { username, password, userType } = request.body
	try {
		await prisma.users.update({
			where: {
				UserID: uId,
			},
			data: {
				Username: username,
				Password: password,
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
