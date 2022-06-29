import { useQuery } from 'react-query'

import { Deck as SeriesDeck } from '@/types/deck'
import axios from '@/lib/axios'

export const getSeriesDeck = async (
  seriesDeckId: string | undefined
): Promise<SeriesDeck> => {
  if (typeof seriesDeckId === undefined) {
    return Promise.reject(new Error('Invalid id'))
  }
  const res = await axios.get(`series_decks/${seriesDeckId}`)
  return res.data.playlist
}

export const useSeriesDeck = (seriesDeckId: string | undefined) =>
  useQuery(['series-deck', seriesDeckId], () => getSeriesDeck(seriesDeckId), {
    enabled: Boolean(seriesDeckId)
  })
