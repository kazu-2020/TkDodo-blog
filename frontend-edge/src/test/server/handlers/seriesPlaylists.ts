import { rest } from 'msw'

import { API_BASE_URL } from '@/config'

import { delayedResponse } from '../utils'
import { seriesPlaylistGenerator } from '../../data-generators'

export const seriesPlaylistsHandlers = [
  rest.get(`${API_BASE_URL}/series_playlists/search`, (req, res, ctx) => {
    try {
      // FIXME: 必要になったら仮想DBを利用するように
      const result = [...Array(10)].map(() => seriesPlaylistGenerator())

      return delayedResponse(
        ctx.json({
          result,
          count: 999,
          nextUrl: `${API_BASE_URL}/series_playlists/search?offset=10`
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
