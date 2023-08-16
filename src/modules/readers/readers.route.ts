import { FastifyInstance } from 'fastify'
import {
  addReaderHandler,
  deleteReaderHandler,
  updateReaderHandler,
  getReaderHandler,
  getReaderByIdHandler,
  searchReaderHandler,
} from './readers.controller'

async function readerRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        tags: ['Reader'],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
          },
          required: ['name', 'phone', 'email'],
        },
      },
    },
    addReaderHandler
  )

  server.delete(
    '/:rId',
    {
      schema: {
        tags: ['Reader'],
        params: {
          type: 'object',
          properties: {
            rId: { type: 'number' },
          },
        },
      },
    },
    deleteReaderHandler
  )

  server.put(
    '/:rId',
    {
      schema: {
        tags: ['Reader'],
        params: {
          type: 'object',
          properties: {
            rId: { type: 'number' },
          },
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
          },
          required: ['name', 'email', 'phone'],
        },
      },
    },
    updateReaderHandler
  )

  server.get(
    '/',
    {
      schema: {
        tags: ['Reader'],
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number' },
          },
        },
      },
    },
    getReaderHandler
  )

  server.get(
    '/:rId',
    {
      schema: {
        tags: ['Reader'],
        params: {
          type: 'object',
          properties: {
            rId: { type: 'number' },
          },
          required: ['rId'],
        },
      },
    },
    getReaderByIdHandler
  )

  server.get(
    '/search',
    {
      schema: {
        tags: ['Reader'],
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            search: { type: 'string' },
          },
        },
      },
    },
    searchReaderHandler
  )
}

export default readerRoutes
