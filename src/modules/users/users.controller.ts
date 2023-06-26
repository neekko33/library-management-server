import prisma from '../../utils/prisma'
import {FastifyReply, FastifyRequest} from 'fastify'

type UserRequest = FastifyRequest<{
  Params: {
    uId?: number
  },
  Body: {
    username: string,
    password: string
    userType: string
  }
}>

export async function getUserHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const categories = await prisma.users.findMany()
    reply.code(200).send({
      data: categories
    })
  } catch (e) {
    reply.code(500).send({msg: e})
  }

}

export async function addUserHandler(request: UserRequest, reply: FastifyReply) {
  const {username, password, userType} = request.body
  try {
    await prisma.users.create({
      data: {
        Username: username,
        Password: password,
        UserType: userType
      }
    })
    reply.code(200).send({msg: 'success'})
  } catch (e) {
    reply.code(500).send({msg: e})
  }
}

export async function updateUserHandler(request: UserRequest, reply: FastifyReply) {
  const {uId} = request.params
  if (!uId) reply.code(500).send({msg: 'need users id.'})
  const {username, password, userType} = request.body
  try {
    await prisma.users.update({
      where: {
        UserID: uId
      },
      data: {
        Username: username,
        Password: password,
        UserType: userType
      }
    })
    reply.code(200).send({msg: 'success'})
  } catch (e) {
    reply.code(500).send({msg: e})
  }
}

export async function deleteUserHandler(request: UserRequest, reply: FastifyReply) {
  const {uId} = request.params
  if (!uId) reply.code(500).send({msg: 'need users id.'})
  try {
    await prisma.users.delete({
      where: {
        UserID: uId
      }
    })
    reply.code(200).send({msg: 'success'})
  } catch (e) {
    reply.code(500).send({msg: e})
  }
}
