import {FastifyInstance} from 'fastify'
import {
  addUserHandler,
  deleteUserHandler,
  updateUserHandler,
  getUserHandler
} from './users.controller'

async function userRoutes(server: FastifyInstance) {
  server.post('/', {
    schema: {
      body: {
        type: 'object',
        properties: {
          username: {type: 'string'},
          password: {type: 'string'},
          userType: {type: 'string'}
        },
        required: ['username', 'password', 'userType']
      }
    }
  }, addUserHandler)

  server.delete('/:uId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          uId: {type: 'number'}
        },
        required: ['uId']
      }
    }
  }, deleteUserHandler)

  server.put('/:uId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          uId: {type: 'number'}
        },
        required: ['uId']
      },
      body: {
        type: 'object',
        properties: {
          username: {type: 'string'},
          password: {type: 'string'},
          userType: {type: 'string'}
        },
        required: ['username', 'password', 'userType']
      }
    }
  }, updateUserHandler)

  server.get('/', getUserHandler)
}

export default userRoutes
