import { rest } from 'msw'

import { API_BASE_URL } from '@/config'

import { delayedResponse } from '../utils'
import { db, persistDb } from '../db'
import { seriesDeckGenerator } from '../../data-generators'

type SeriesDeckBody = {
  name: string
  interfix: string
  description: string
  apiState: string
}

export const seriesDecksHandlers = [
  rest.get(`${API_BASE_URL}/series_decks`, (req, res, ctx) => {
    try {
      const result = db.seriesDeck.getAll()

      return delayedResponse(ctx.json({ series_decks: result }))
    } catch (error: any) {
      return delayedResponse(
        ctx.status(400),
        ctx.json({ message: error?.message || 'Server Error' })
      )
    }
  }),

  rest.get(`${API_BASE_URL}/series_decks/:seriesDeckId`, (req, res, ctx) => {
    try {
      const { seriesDeckId } = req.params
      const result = db.seriesDeck.findFirst({
        where: {
          id: {
            equals: seriesDeckId as string
          }
        }
      })
      return delayedResponse(ctx.json({ deck: result }))
    } catch (error: any) {
      return delayedResponse(
        ctx.status(400),
        ctx.json({ message: error?.message || 'Server Error' })
      )
    }
  }),

  rest.post<SeriesDeckBody>(`${API_BASE_URL}/series_decks`, (req, res, ctx) => {
    try {
      const data = req.body
      const dummyData = seriesDeckGenerator()
      const result = db.seriesDeck.create({
        ...data,
        id: dummyData.id,
        stringId: dummyData.stringId,
        adminMemo: dummyData.adminMemo
      })
      persistDb('seriesDeck')
      return delayedResponse(ctx.json(result))
    } catch (error: any) {
      return delayedResponse(
        ctx.status(400),
        ctx.json({ message: error?.message || 'Server Error' })
      )
    }
  }),

  rest.patch<SeriesDeckBody>(
    `${API_BASE_URL}/series_decks/:seriesDeckId`,
    (req, res, ctx) => {
      try {
        const data = req.body
        const { seriesDeckId } = req.params
        const result = db.seriesDeck.update({
          where: {
            id: {
              equals: seriesDeckId as string
            }
          },
          data
        })
        persistDb('seriesDeck')
        return delayedResponse(ctx.json({ deck: result }))
      } catch (error: any) {
        return delayedResponse(
          ctx.status(400),
          ctx.json({ message: error?.message || 'Server Error' })
        )
      }
    }
  ),

  rest.delete(`${API_BASE_URL}/series_decks/:seriesDeckId`, (req, res, ctx) => {
    try {
      const { seriesDeckId } = req.params
      const result = db.seriesDeck.delete({
        where: {
          id: {
            equals: seriesDeckId as string
          }
        }
      })
      persistDb('seriesDeck')
      return delayedResponse(ctx.json(result))
    } catch (error: any) {
      return delayedResponse(
        ctx.status(400),
        ctx.json({ message: error?.message || 'Server Error' })
      )
    }
  })
]
