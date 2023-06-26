import {FastifyInstance} from 'fastify'
import {addBookHandler, deleteBookHandler, updateBookHandler, getBooksHandler} from './books.controller'

async function bookRoutes(server: FastifyInstance) {
  server.post('/', {
    schema: {
      body: {
        type: 'object',
        properties: {
          id: {type: 'number'},
          title: {type: 'string'},
          author: {type: 'string'},
          publicationDate: {type: 'string'},
          publishingHouse: {type: 'string'},
          isbn: {type: 'string'},
          price: {type: 'string'},
          categoryId: {type: 'number'},
          availabilityStatus: {type: 'string'},
          location: {type: 'string'},
          ImgUrl: {type: 'string'},
          Introduction: {type: 'string'},
        },
        required: [
          'bookId',
          'title',
          'author',
          'publicationDate',
          'publishingHouse',
          'isbn',
          'price',
          'categoryId',
          'availabilityStatus',
          'location',
          'imgUrl',
          'introduction'
        ]
      }
    },
  }, addBookHandler)

  server.delete('/:bookId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          bookId: {type: 'number'}
        }
      }
    },
  }, deleteBookHandler)

  server.put('/:bookId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          bookId: {type: 'number'}
        }
      },
      body: {
        type: 'object',
        properties: {
          id: {type: 'number'},
          title: {type: 'string'},
          author: {type: 'string'},
          publicationDate: {type: 'string'},
          publishingHouse: {type: 'string'},
          isbn: {type: 'string'},
          price: {type: 'string'},
          categoryId: {type: 'number'},
          availabilityStatus: {type: 'string'},
          location: {type: 'string'},
          ImgUrl: {type: 'string'},
          Introduction: {type: 'string'},
        },
      }
    },
  }, updateBookHandler)

  server.get('/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: {type: 'number'},
        },
      }
    },
  }, getBooksHandler)
}

export default bookRoutes
