import prisma from '../../utils/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'

type BorrowRequest = FastifyRequest<{
  Params: {
    bId?: number
    rId?: number
  }
  Querystring: {
    page?: number
    search?: string
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
    if (overdueCount > 0) {
      reply.code(500).send({ msg: '有未结清罚款的逾期图书，请结清后重试' })
      return true
    }
    return false
  } catch (e) {
    reply.code(500).send({ msg: e })
    return true
  }
}

export async function searchBorrowsHandler(
  request: BorrowRequest,
  reply: FastifyReply
) {
  try {
    let { search, page } = request.query
    if (!search) return
    if (!page) page = 1
    const allRecords = await prisma.borrows.findMany({
      where: {
        OR: [
          {
            Readers: {
              Name: {
                contains: search,
              },
            },
          },
          {
            Books: {
              Title: {
                contains: search,
              },
            },
          },
        ],
      },
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
    const total = allRecords.length
    const borrows = await prisma.borrows.findMany({
      where: {
        OR: [
          {
            Readers: {
              Name: {
                contains: search,
              },
            },
          },
          {
            Books: {
              Title: {
                contains: search,
              },
            },
          },
        ],
      },
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
      take: 13,
      skip: (page - 1) * 13,
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
        // ReaderID: rId,
        ReturnDate: null,
      },
    })
    let { page } = request.query
    if (!page) page = 1
    const borrows = await prisma.borrows.findMany({
      where: {
        // ReaderID: rId,
        ReturnDate: null,
      },
      take: 7,
      skip: (page - 1) * 7,
      include: {
        Books: {
          select: {
            Title: true,
          },
        },
      },
    })
    reply.code(200).send({
      total,
      page,
      data: borrows,
    })
  } catch (e) {
    reply.code(500).send({ msg: e })
  }
}

export async function getBorrowsHistoryByReadIdHandler(
  request: BorrowRequest,
  reply: FastifyReply
) {
  try {
    const { rId } = request.params
    const total = await prisma.borrows.count({
      where: {
        // ReaderID: rId,
        ReturnDate: {
          not: null,
        },
      },
    })
    let { page } = request.query
    if (!page) page = 1
    const borrows = await prisma.borrows.findMany({
      where: {
        // ReaderID: rId,
        ReturnDate: {
          not: null,
        },
      },
      take: 7,
      skip: (page - 1) * 7,
      include: {
        Books: {
          select: {
            Title: true,
          },
        },
      },
    })
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
  const isOverdue = await checkOverdueByReaderId(readerId, reply)
  if (isOverdue) return
  try {
    const book = await prisma.books.findUnique({
      select: { AvailabilityStatus: true },
      where: { BookID: bookId },
    })
    if (!book || book.AvailabilityStatus == '借出') {
      reply.code(500).send({ msg: '该图书不存在或已借出，请重新操作' })
      return
    }
    const borrowDate = new Date()
    const dueDate = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
    await prisma.borrows.create({
      data: {
        BookID: bookId,
        ReaderID: readerId,
        BorrowDate: borrowDate,
        DueDate: dueDate,
        IsOverdue: false,
      },
    })
    await prisma.books.update({
      where: { BookID: bookId },
      data: { AvailabilityStatus: '借出' },
    })
    reply.code(200).send({ msg: '操作成功' })
  } catch (e) {
    reply.code(500).send({ msg: e })
  }
}

export async function deleteBorrowHandler(
  request: BorrowRequest,
  reply: FastifyReply
) {
  const { bId } = request.params
  if (!bId) reply.code(500).send({ msg: 'ID格式错误，请重新操作' })
  const returnDate = new Date()
  try {
    const borrow = await prisma.borrows.findUnique({
      select: { BookID: true, ReaderID: true },
      where: { BorrowID: bId },
    })
    if (!borrow) {
      reply.code(500).send({ msg: '借阅记录不存在，请重新操作' })
      return
    }
    const isOverdue = await checkOverdueByReaderId(borrow.ReaderID, reply)
    if (isOverdue) return
    await prisma.borrows.update({
      where: {
        BorrowID: bId,
      },
      data: {
        ReturnDate: returnDate,
      },
    })
    await prisma.books.update({
      where: { BookID: borrow.BookID },
      data: { AvailabilityStatus: '在馆' },
    })
    reply.code(200).send({ msg: '操作成功' })
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
  if (!bId) reply.code(500).send({ msg: 'ID格式错误，请重新操作' })
  try {
    const borrow = await prisma.borrows.findUnique({
      select: { DueDate: true, ReaderID: true },
      where: { BorrowID: bId },
    })
    if (!borrow) {
      reply.code(500).send({ msg: '借阅记录不存在，请重新操作' })
      return
    }
    const isOverdue = await checkOverdueByReaderId(borrow.ReaderID, reply)
    if (isOverdue) return
    const newDueDate = new Date(
      borrow.DueDate.getTime() + 30 * 24 * 60 * 60 * 1000
    )
    await prisma.borrows.update({
      where: {
        BorrowID: bId,
      },
      data: {
        DueDate: newDueDate,
      },
    })
    reply.code(200).send({ msg: '操作成功' })
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
        (new Date().getTime() - item.DueDate.getTime()) / (1000 * 60 * 60 * 24)
      if (days >= 1) {
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
