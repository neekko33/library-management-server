import prisma from '../../utils/prisma'
import {FastifyReply, FastifyRequest} from 'fastify'

type CategoryRequest = FastifyRequest<{
  Params: {
    cId?: number
  },
  Querystring: {
    page?: number
  },
  Body: {
    categoryName: string,
    categoryChar: string
  }
}>

export async function getCategoriesHandler(request: CategoryRequest, reply: FastifyReply) {
  try {
    const total = await prisma.categories.count()
    let {page} = request.query
    if (!page) page = 1
    const categories = await prisma.categories.findMany()
    reply.code(200).send({
      total,
      page,
      data: categories
    })
  } catch (e) {
    reply.code(500).send({msg: e})
  }

}

export async function addCategoryHandler(request: CategoryRequest, reply: FastifyReply) {
  const {categoryName, categoryChar} = request.body
  try {
    await prisma.categories.create({
      data: {
        CategoryName: categoryName,
        CategoryChar: categoryChar
      }
    })
    reply.code(200).send({msg: 'success'})
  } catch (e) {
    reply.code(500).send({msg: e})
  }
}

export async function updateCategoryHandler(request: CategoryRequest, reply: FastifyReply) {
  const {cId} = request.params
  if (!cId) reply.code(500).send({msg: 'need category id.'})
  const {categoryName, categoryChar} = request.body
  try {
    await prisma.categories.update({
      where: {
        CategoryID: cId
      },
      data: {
        CategoryName: categoryName,
        CategoryChar: categoryChar
      }
    })
    reply.code(200).send({msg: 'success'})
  } catch (e) {
    reply.code(500).send({msg: e})
  }
}

export async function deleteCategoryHandler(request: CategoryRequest, reply: FastifyReply) {
  const {cId} = request.params
  if (!cId) reply.code(500).send({msg: 'need category id.'})
  try {
    await prisma.categories.delete({
      where: {
        CategoryID: cId
      }
    })
    reply.code(200).send({msg: 'success'})
  } catch (e) {
    reply.code(500).send({msg: e})
  }
}
