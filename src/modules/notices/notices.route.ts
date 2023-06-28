import {FastifyInstance} from 'fastify'
import {addNoticeHandler, deleteNoticeHandler, updateNoticeHandler, getNoticeHandler} from './notices.controller'

async function noticeRoutes(server: FastifyInstance) {
  server.post('/', {
    schema: {
      body: {
        type: 'object',
        properties: {
          title: {type: 'string'},
          content: {type: 'string'},
          publishDate: {type: 'object'}
        },
        required: ['title', 'content', 'publishDate']
      },
    }
  }, addNoticeHandler)

  server.delete('/:nId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          nId: {type: 'number'}
        }
      }
    }
  }, deleteNoticeHandler)

  server.put('/:nId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          nId: {type: 'number'}
        }
      },
      body: {
        type: 'object',
        properties: {
          title: {type: 'string'},
          content: {type: 'string'},
          publishDate: {type: 'object'}
        },
        required: ['title', 'content', 'publishDate']
      },
    }
  }, updateNoticeHandler)

  server.get('/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: {type: 'number'},
        },
      }
    },
  }, getNoticeHandler)
}

export default noticeRoutes
