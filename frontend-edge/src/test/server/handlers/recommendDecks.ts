import { rest } from 'msw'

import { SameAs } from '@/types/same_as'
import { API_BASE_URL } from '@/config'

import { delayedResponse } from '../utils'
import { db, persistDb } from '../db'
import { recommendDeckGenerator } from '../../data-generators'

type RecommendDeckBody = {
  name: string
  interfix: string
  description: string
  apiState: string
  deckSameAsAttributes?: SameAs[]
  playlists?: number[]
}

export const recommendDecksHandlers = [
  rest.get(`${API_BASE_URL}/decks`, (req, res, ctx) => {
    try {
      const result = db.recommendDeck.getAll()

      return delayedResponse(
        ctx.json({
          decks: result,
          pagination: {
            count: result.length
          }
        })
      )
    } catch (error: any) {
      return delayedResponse(
        ctx.status(400),
        ctx.json({ message: error?.message || 'Server Error' })
      )
    }
  }),

  rest.get(`${API_BASE_URL}/decks/:recommendDeckId`, (req, res, ctx) => {
    try {
      const { recommendDeckId } = req.params
      const result = db.recommendDeck.findFirst({
        where: {
          id: {
            equals: recommendDeckId as string
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

  rest.post<RecommendDeckBody>(`${API_BASE_URL}/decks`, (req, res, ctx) => {
    try {
      const data = req.body
      const dummyData = recommendDeckGenerator()
      const result = db.recommendDeck.create({
        ...data,
        id: dummyData.id,
        stringId: dummyData.stringId,
        adminMemo: dummyData.adminMemo
      })
      persistDb('recommendDeck')
      return delayedResponse(ctx.json(result))
    } catch (error: any) {
      return delayedResponse(
        ctx.status(400),
        ctx.json({ message: error?.message || 'Server Error' })
      )
    }
  }),

  rest.patch<RecommendDeckBody>(
    `${API_BASE_URL}/decks/:recommendDeckId`,
    (req, res, ctx) => {
      try {
        const data = req.body
        const { recommendDeckId } = req.params
        const result = db.recommendDeck.update({
          where: {
            id: {
              equals: recommendDeckId as string
            }
          },
          data
        })
        persistDb('recommendDeck')
        return delayedResponse(ctx.json({ deck: result }))
      } catch (error: any) {
        return delayedResponse(
          ctx.status(400),
          ctx.json({ message: error?.message || 'Server Error' })
        )
      }
    }
  ),

  rest.delete(`${API_BASE_URL}/decks/:recommendDeckId`, (req, res, ctx) => {
    try {
      const { recommendDeckId } = req.params
      const result = db.recommendDeck.delete({
        where: {
          id: {
            equals: recommendDeckId as string
          }
        }
      })
      persistDb('recommendDeck')
      return delayedResponse(ctx.json(result))
    } catch (error: any) {
      return delayedResponse(
        ctx.status(400),
        ctx.json({ message: error?.message || 'Server Error' })
      )
    }
  })
]
