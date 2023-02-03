import { rest } from 'msw'

import { API_BASE_URL } from '@/config'

import { delayedResponse } from '../utils'
import { db } from '../db'

export const announcementsHandlers = [
  rest.get(`${API_BASE_URL}/announcements`, (req, res, ctx) => {
    try {
      const announcements = db.announcement.getAll()

      return delayedResponse(
        ctx.json({
          announcements,
          pagination: {
            count: announcements.length
          }
        })
      )
    } catch (error: any) {
      return delayedResponse(
        ctx.status(400),
        ctx.json({ message: error?.message || 'Server Error' })
      )
    }
  })
]
