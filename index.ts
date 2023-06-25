import Fastify, {FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import {Server, IncomingMessage, ServerResponse} from "http";
import {PrismaClient} from "@prisma/client";

const server: FastifyInstance = Fastify({});

const prisma = new PrismaClient();

type BookRequest = FastifyRequest<{
    Body: {
        bookId: number,
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

// add a new book
server.route({
    method: "POST",
    url: "/books",
    schema: {
        body: {
            type: "object",
            properties: {
                id: {type: "number"},
                title: {type: "string"},
                author: {type: "string"},
                publicationDate: {type: "date"},
                publishingHouse: {type: "string"},
                isbn: {type: "string"},
                price: {type: "string"},
                categoryId: {type: "number"},
                availabilityStatus: {type: "string"},
                location: {type: "string"},
                ImgUrl: {type: "string"},
                Introduction: {type: "string"},
            },
            required: [
                "bookId",
                "title",
                "author",
                "publicationDate",
                "publishingHouse",
                "isbn",
                "price",
                "categoryId",
                "availabilityStatus",
                "location",
                "imgUrl",
                "introduction"
            ]
        }
    },
    handler: async (request: BookRequest, reply: FastifyReply) => {
        const {
            bookId,
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
        } = request.body;
        const result = await prisma.books.create({
            data: {
                BookID: bookId,
                Title: title,
                Author: author,
                PublicationDate: publicationDate,
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
            {}
        )
    }
})

// find all books
server.route({
    method: "GET",
    url: "/books",
    schema: {
        querystring: {
            type: "object",
            properties: {
                page: {type: "number"},
            },
        }
    },
    handler: async (request: FastifyRequest<{
        Querystring: { page: number }
    }>, reply: FastifyReply) => {
        const total = await prisma.books.count();
        const {page} = request.query;
        const books = await prisma.books.findMany({take: 10, skip: (page - 1) * 10});
        reply.code(200).send(
            {
                total,
                page,
                data: books,
            }
        )
    }
})

const start = async () => {
    try {
        await server.listen({port: 3000});
    } catch (e) {
        server.log.error(e);
        process.exit(1);
    }
};

start();
