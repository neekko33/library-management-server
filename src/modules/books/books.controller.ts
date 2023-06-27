import {FastifyReply, FastifyRequest} from 'fastify'
import prisma from '../../utils/prisma'

type BookRequest = FastifyRequest<{
  Params: {
    bookId?: number
  },
  Querystring: {
    page?: number
  },
  Body: {
    title: string,
    author: string,
    publicationDate: Date,
    publishingHouse: string,
    isbn: string,
    price: string,
    categoryId: number,
    availabilityStatus: string,
    location: string,
    imgUrl: string,
    introduction: string,
  }
}>

export async function getBooksHandler(request: BookRequest, reply: FastifyReply) {
  const total = await prisma.books.count()
  let {page} = request.query
  if (!page) page = 1
  const books = await prisma.books.findMany({take: 10, skip: (page - 1) * 10})
  reply.code(200).send(
    {
      total,
      page,
      data: books,
    }
  )
}

export async function addBookHandler(request: BookRequest, reply: FastifyReply) {
  const {
    title,
    author,
    publicationDate,
    publishingHouse,
    isbn,
    price,
    categoryId,
    availabilityStatus,
    location,
    imgUrl,
    introduction
  } = request.body
  const publicationDateTime = new Date(publicationDate)
  await prisma.books.create({
    data: {
      Title: title,
      Author: author,
      PublicationDate: publicationDateTime,
      PublishingHouse: publishingHouse,
      ISBN: isbn,
      Price: price,
      CategoryID: categoryId,
      AvailabilityStatus: availabilityStatus,
      Location: location,
      ImgUrl: imgUrl,
      Introduction: introduction
    }
  })
  reply.code(200).send(
    {
      msg: 'success'
    }
  )
}

export async function updateBookHandler(request: BookRequest, reply: FastifyReply) {
  const {
    title,
    author,
    publicationDate,
    publishingHouse,
    isbn,
    price,
    categoryId,
    availabilityStatus,
    location,
    imgUrl,
    introduction
  } = request.body
  const publicationDateTime = new Date(publicationDate)
  await prisma.books.update({
    where: {BookID: request.params.bookId}, data: {
      BookID: request.params.bookId,
      Title: title,
      Author: author,
      PublicationDate: publicationDateTime,
      PublishingHouse: publishingHouse,
      ISBN: isbn,
      Price: price,
      CategoryID: categoryId,
      AvailabilityStatus: availabilityStatus,
      Location: location,
      ImgUrl: imgUrl,
      Introduction: introduction
    }
  })
  reply.code(200).send(
    {
      msg: 'success'
    }
  )
}

// 删除图书
export async function deleteBookHandler(request: BookRequest, reply: FastifyReply) {
  await prisma.books.delete({
    where: {BookID: request.params.bookId}
  })
  reply.code(200).send(
    {
      msg: 'success'
    }
  )
}
