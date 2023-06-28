import {FastifyInstance} from 'fastify'
import {addReaderHandler, deleteReaderHandler, updateReaderHandler, getReaderHandler} from './readers.controller'

async function readerRoutes(server: FastifyInstance) {
  server.post('/', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: {type: 'string'},
          password: {type: 'string'},
          contactInformation: {type: 'string'}
        },
        required: ['name', 'password', 'contactInformation']
      },
    }
  }, addReaderHandler)

  server.delete('/:rId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          rId: {type: 'number'}
        }
      }
    }
  }, deleteReaderHandler)

  server.put('/:rId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          rId: {type: 'number'}
        }
      },
      body: {
        type: 'object',
        properties: {
          name: {type: 'string'},
          password: {type: 'string'},
          contactInformation: {type: 'string'}
        },
        required: ['name', 'password', 'contactInformation']
      },
    }
  }, updateReaderHandler)

  server.get('/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: {type: 'number'},
        },
      }
    },
  }, getReaderHandler)
}

export default readerRoutes
