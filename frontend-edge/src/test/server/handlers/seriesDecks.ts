import { rest } from 'msw'

import { API_BASE_URL } from '@/config'

import { delayedResponse } from '../utils'
import { seriesDeckGenerator } from '../../data-generators'

type SeriesDeckBody = {
  name: string
  interfix: string
  description: string
  apiState: string
}

export const seriesDecksHandlers = [
  rest.get(`http://localhost:8888/series_decks`, (req, res, ctx) => {
    try {
      const seriesDecks = [...Array(20)].map(() => seriesDeckGenerator())

      return delayedResponse(ctx.json({ series_decks: seriesDecks }))
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
      const result = { ...seriesDeckGenerator(), id: seriesDeckId }
      return delayedResponse(ctx.json(result))
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
      const result = {
        ...seriesDeckGenerator(),
        ...data
      }
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
        const result = {
          id: seriesDeckId,
          ...data
        }
        return delayedResponse(ctx.json(result))
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
      const result = { ...seriesDeckGenerator(), id: seriesDeckId }
      return delayedResponse(ctx.json(result))
    } catch (error: any) {
      return delayedResponse(
        ctx.status(400),
        ctx.json({ message: error?.message || 'Server Error' })
      )
    }
  })
]
