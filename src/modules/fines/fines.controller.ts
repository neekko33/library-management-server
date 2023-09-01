import prisma from '../../utils/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

type FineRequest = FastifyRequest<{
  Params: {
    fId?: number
    bId?: number
    rId?: number
  }
  Querystring: {
    page?: number
  }
  Body: {
    borrowId?: number
  }
}>

export async function getFinesHandler(
  request: FineRequest,
  reply: FastifyReply
) {
  try {
    const total = await prisma.fines.count()
    let { page } = request.query
    if (!page) page = 1
    const fines = await prisma.fines.findMany({
      take: 13,
      skip: (page - 1) * 13,
    })
    reply.code(200).send({
      total,
      page,
      data: fines,
    })
  } catch (e) {
    reply.code(500).send({ msg: e })
  }
}

export async function getFineByReaderIdHandler(
  request: FineRequest,
  reply: FastifyReply
) {
  try {
    const readerId = request.params.rId
    const totalFines = await prisma.fines.findMany({
      include: {
        Borrows: {
          include: {
            Readers: {
              select: {
                ReaderID: true,
              },
            },
            Books: {
              select: {
                Title: true,
              },
            },
          },
        },
      },
      where: {
        Borrows: {
          Readers: {
            ReaderID: readerId,
          },
        },
      },
    })
    const total = totalFines.length
    let { page } = request.query
    if (!page) page = 1
    const fines = await prisma.fines.findMany({
      include: {
        Borrows: {
          include: {
            Readers: {
              select: {
                ReaderID: true,
              },
            },
            Books: {
              select: {
                Title: true,
              },
            },
          },
        },
      },
      where: {
        Borrows: {
          Readers: {
            ReaderID: readerId,
          },
        },
      },
      take: 7,
      skip: (page - 1) * 7,
    })
    reply.code(200).send({
      total,
      page,
      data: fines,
    })
  } catch (e) {
    reply.code(500).send({ msg: e })
  }
}

export async function getFineByBorrowIdHandler(
  request: FineRequest,
  reply: FastifyReply
) {
  const { bId } = request.params
  if (!bId) {
    reply.code(500).send({ msg: '借阅记录不存在，请重新操作' })
    return
  }
  try {
    let { page } = request.query
    if (!page) page = 1
    const total = await prisma.fines.count({
      where: {
        BorrowID: bId,
      },
    })
    const data = await prisma.fines.findMany({
      take: 13,
      skip: (page - 1) * 13,
      where: {
        BorrowID: bId,
      },
    })
    reply.code(200).send({
      data,
      total,
      page,
    })
  } catch (e) {
    reply.code(500).send({ msg: e })
  }
}

export async function payFineHandler(
  request: FineRequest,
  reply: FastifyReply
) {
  try {
    const fineId = request.params.fId
    const fine = await prisma.fines.findUnique({
      select: {
        BorrowID: true,
      },
      where: {
        FineID: fineId,
      },
    })
    if (!fine) {
      reply.code(500).send({ msg: '未找到罚款记录！' })
      return
    }
    const borrowId = fine.BorrowID as number
    await prisma.fines.update({
      where: {
        FineID: fineId,
      },
      data: {
        IsPaid: true,
      },
    })
    await prisma.borrows.update({
      where: {
        BorrowID: borrowId,
      },
      data: {
        DueDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        IsOverdue: false,
      },
    })
    reply.code(200).send({ msg: '操作成功' })
  } catch (e) {
    reply.code(500).send({ msg: e })
  }
}
