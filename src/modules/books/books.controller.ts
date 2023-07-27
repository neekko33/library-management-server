import { FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../../utils/prisma'

type BookRequest = FastifyRequest<{
	Params: {
		bookId?: number
	}
	Querystring: {
		page?: number
		search?: string
	}
	Body: {
		title: string
		author: string
		publicationDate: Date
		publishingHouse: string
		isbn: string
		price: string
		categoryId: number
		availabilityStatus: string
		location: string
		imgUrl: string
		introduction: string
	}
}>

type BookResult = {
	BookID: number
	Title: string | null
	Author: string | null
	PublicationDate: object | null
	PublishingHouse: string | null
	ISBN: string | null
	Category: string | null
	AvailabilityStatus: string | null
	Location: string | null
}

export async function searchBooksHandler(
	request: BookRequest,
	reply: FastifyReply
) {
	try {
		let { search, page } = request.query
		if (!search) return
		if (!page) page = 1
		const total = await prisma.books.count({
			where: {
				OR: [
					{
						Title: {
							contains: search,
						},
					},
					{
						Author: {
							contains: search,
						},
					},
					{
						PublishingHouse: {
							contains: search,
						},
					},
				],
			},
		})
		const books = await prisma.books.findMany({
			where: {
				OR: [
					{
						Title: {
							contains: search,
						},
					},
					{
						Author: {
							contains: search,
						},
					},
					{
						PublishingHouse: {
							contains: search,
						},
					},
				],
			},
			take: 13,
			skip: (page - 1) * 13,
			include: { Categories: { select: { CategoryChar: true } } },
		})
		const data: BookResult[] = []
		books.map(item => {
			data.push({
				BookID: item.BookID,
				Title: item.Title,
				Author: item.Author,
				PublicationDate: item.PublicationDate,
				PublishingHouse: item.PublishingHouse,
				ISBN: item.ISBN,
				Category: item.Categories.CategoryChar,
				AvailabilityStatus: item.AvailabilityStatus,
				Location: item.Location,
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

export async function getBooksHandler(
	request: BookRequest,
	reply: FastifyReply
) {
	const total = await prisma.books.count()
	let { page } = request.query
	if (!page) page = 1
	const books = await prisma.books.findMany({
		take: 13,
		skip: (page - 1) * 13,
		include: { Categories: { select: { CategoryChar: true } } },
	})
	const data: BookResult[] = []
	books.map(item => {
		data.push({
			BookID: item.BookID,
			Title: item.Title,
			Author: item.Author,
			PublicationDate: item.PublicationDate,
			PublishingHouse: item.PublishingHouse,
			ISBN: item.ISBN,
			Category: item.Categories.CategoryChar,
			AvailabilityStatus: item.AvailabilityStatus,
			Location: item.Location,
		})
	})
	reply.code(200).send({
		total,
		page,
		data,
	})
}

export async function getBookByIdHandler(
	request: BookRequest,
	reply: FastifyReply
) {
	try {
		const bookId = request.params.bookId
		const book = await prisma.books.findUnique({
			where: {
				BookID: bookId,
			},
		})
		reply.code(200).send({
			data: book,
		})
	} catch (e) {
		reply.code(500).send({ msg: e })
	}
}

export async function addBookHandler(
	request: BookRequest,
	reply: FastifyReply
) {
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
		introduction,
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
			Introduction: introduction,
		},
	})
	reply.code(200).send({
		msg: 'success',
	})
}

export async function updateBookHandler(
	request: BookRequest,
	reply: FastifyReply
) {
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
		introduction,
	} = request.body
	const publicationDateTime = new Date(publicationDate)
	await prisma.books.update({
		where: { BookID: request.params.bookId },
		data: {
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
			Introduction: introduction,
		},
	})
	reply.code(200).send({
		msg: 'success',
	})
}

// 删除图书
export async function deleteBookHandler(
	request: BookRequest,
	reply: FastifyReply
) {
	await prisma.books.delete({
		where: { BookID: request.params.bookId },
	})
	reply.code(200).send({
		msg: 'success',
	})
}
