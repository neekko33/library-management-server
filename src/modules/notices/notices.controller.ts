import prisma from '../../utils/prisma'
import {FastifyReply, FastifyRequest} from 'fastify'

type NoticeRequest = FastifyRequest<{
    Params: {
        nId?: number
    }
    Querystring: {
        page?: number
    }
    Body: {
        title: string
        content: string
        creationDate: Date
        userId: number
    }
}>

type NoticeResult = {
    NoticeID: number,
    Title: string,
    CreationDate: object,
    Author: string | null
}

export async function getNoticeHandler(
    request: NoticeRequest,
    reply: FastifyReply
) {
    try {
        const total = await prisma.notices.count()
        let {page} = request.query
        if (!page) page = 1
        const notices = await prisma.notices.findMany({
            take: 13,
            skip: (page - 1) * 13,
            include: {
                Users: {
                    select: {
                        Username: true
                    }
                }
            }
        })
        const data: NoticeResult[] = []
        notices.map(item => {
            data.push({
                NoticeID: item.NoticeID,
                Title: item.Title,
                CreationDate: item.CreationDate,
                Author: item.Users.Username
            })
        })
        reply.code(200).send({
            total,
            page,
            data,
        })
    } catch (e) {
        reply.code(500).send({msg: e})
    }
}

export async function addNoticeHandler(
    request: NoticeRequest,
    reply: FastifyReply
) {
    const {title, content, creationDate, userId} = request.body
    try {
        await prisma.notices.create({
            data: {
                Title: title,
                Content: content,
                CreationDate: creationDate,
                UserID: userId,
            },
        })
        reply.code(200).send({msg: 'success'})
    } catch (e) {
        reply.code(500).send({msg: e})
    }
}

export async function updateNoticeHandler(
    request: NoticeRequest,
    reply: FastifyReply
) {
    const {nId} = request.params
    if (!nId) reply.code(500).send({msg: 'need notice id.'})
    const {title, content, creationDate, userId} = request.body
    try {
        await prisma.notices.update({
            where: {
                NoticeID: nId,
            },
            data: {
                Title: title,
                Content: content,
                CreationDate: creationDate,
                UserID: userId,
            },
        })
        reply.code(200).send({msg: 'success'})
    } catch (e) {
        reply.code(500).send({msg: e})
    }
}

export async function deleteNoticeHandler(
    request: NoticeRequest,
    reply: FastifyReply
) {
    const {nId} = request.params
    if (!nId) reply.code(500).send({msg: 'need notice id.'})
    try {
        await prisma.notices.delete({
            where: {
                NoticeID: nId,
            },
        })
        reply.code(200).send({msg: 'success'})
    } catch (e) {
        reply.code(500).send({msg: e})
    }
}
