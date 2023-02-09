import { rest } from 'msw'

import { API_BASE_URL } from '@/config'

import { delayedResponse } from '../utils'
import { db } from '../db'

export const usersHandlers = [
  rest.get(`${API_BASE_URL}/users`, (req, res, ctx) => {
    try {
      const users = db.user.getAll()

      return delayedResponse(
        ctx.json({
          users,
          pagination: {
            count: users.length
          }
        })
      )
    } catch (error: any) {
      return delayedResponse(
        ctx.status(500),
        ctx.json({ message: error.message || 'Server Error' })
      )
    }
  })
]
