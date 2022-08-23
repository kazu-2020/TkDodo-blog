import { rest } from 'msw'

import { API_BASE_URL } from '@/config'

import { delayedResponse } from '../utils'
import { db, persistDb } from '../db'
import { playlistGenerator } from '../../data-generators'

type PlaylistBody = {
  name: string
  interfix: string
  description: string
  apiState: string
}

export const playlistsHandlers = [
  rest.get(`${API_BASE_URL}/playlists`, (req, res, ctx) => {
    try {
      const result = db.playlist.getAll()

      return delayedResponse(
        ctx.json({
          playlists: result,
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

  rest.get(`${API_BASE_URL}/playlists/:playlistId`, (req, res, ctx) => {
    try {
      const { playlistId } = req.params
      const result = db.playlist.findFirst({
        where: {
          id: {
            equals: playlistId as string
          }
        }
      })
      return delayedResponse(ctx.json({ playlist: result }))
    } catch (error: any) {
      return delayedResponse(
        ctx.status(400),
        ctx.json({ message: error?.message || 'Server Error' })
      )
    }
  }),

  rest.post<PlaylistBody>(`${API_BASE_URL}/playlists`, (req, res, ctx) => {
    try {
      const data = req.body
      const dummyData = playlistGenerator()
      const result = db.playlist.create({
        ...data,
        id: dummyData.id,
        stringId: dummyData.stringId
      })
      persistDb('playlist')
      return delayedResponse(ctx.json(result))
    } catch (error: any) {
      return delayedResponse(
        ctx.status(400),
        ctx.json({ message: error?.message || 'Server Error' })
      )
    }
  }),

  rest.patch<PlaylistBody>(
    `${API_BASE_URL}/playlists/:playlistId`,
    (req, res, ctx) => {
      try {
        const data = req.body
        const { playlistId } = req.params
        const result = db.playlist.update({
          where: {
            id: {
              equals: playlistId as string
            }
          },
          data
        })
        persistDb('playlist')
        return delayedResponse(ctx.json({ playlist: result }))
      } catch (error: any) {
        return delayedResponse(
          ctx.status(400),
          ctx.json({ message: error?.message || 'Server Error' })
        )
      }
    }
  ),

  rest.delete(`${API_BASE_URL}/playlists/:playlistId`, (req, res, ctx) => {
    try {
      const { playlistId } = req.params
      const result = db.playlist.delete({
        where: {
          id: {
            equals: playlistId as string
          }
        }
      })
      persistDb('playlist')
      return delayedResponse(ctx.json(result))
    } catch (error: any) {
      return delayedResponse(
        ctx.status(400),
        ctx.json({ message: error?.message || 'Server Error' })
      )
    }
  })
]
