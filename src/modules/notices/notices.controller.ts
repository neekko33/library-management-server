import prisma from '../../utils/prisma'
import {FastifyReply, FastifyRequest} from 'fastify'

type NoticeRequest = FastifyRequest<{
  Params: {
    nId?: number
  },
  Querystring: {
    page?: number
  },
  Body: {
    title: string,
    content: string
    publishDate: Date
  }
}>

export async function getNoticeHandler(request: NoticeRequest, reply: FastifyReply) {
  try {
    const total = await prisma.notices.count()
    let {page} = request.query
    if (!page) page = 1
    const notices = await prisma.notices.findMany({take: 10, skip: (page - 1) * 10})
    reply.code(200).send({
      total,
      page,
      data: notices
    })
  } catch (e) {
    reply.code(500).send({msg: e})
  }

}

export async function addNoticeHandler(request: NoticeRequest, reply: FastifyReply) {
  const {title, content, publishDate} = request.body
  try {
    await prisma.notices.create({
      data: {
        Title: title,
        Content: content,
        PublishDate: publishDate
      }
    })
    reply.code(200).send({msg: 'success'})
  } catch (e) {
    reply.code(500).send({msg: e})
  }
}

export async function updateNoticeHandler(request: NoticeRequest, reply: FastifyReply) {
  const {nId} = request.params
  if (!nId) reply.code(500).send({msg: 'need notice id.'})
  const {title, content, publishDate} = request.body
  try {
    await prisma.notices.update({
      where: {
        NoticeID: nId
      },
      data: {
        Title: title,
        Content: content,
        PublishDate: publishDate
      }
    })
    reply.code(200).send({msg: 'success'})
  } catch (e) {
    reply.code(500).send({msg: e})
  }
}

export async function deleteNoticeHandler(request: NoticeRequest, reply: FastifyReply) {
  const {nId} = request.params
  if (!nId) reply.code(500).send({msg: 'need notice id.'})
  try {
    await prisma.notices.delete({
      where: {
        NoticeID: nId
      }
    })
    reply.code(200).send({msg: 'success'})
  } catch (e) {
    reply.code(500).send({msg: e})
  }
}
