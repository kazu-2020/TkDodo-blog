import { useQuery } from '@tanstack/react-query'

import { SeriesDeck } from '@/types/series_deck'
import axios from '@/lib/axios'

export const getSeriesDeck = async (
  seriesDeckId: string | undefined
): Promise<SeriesDeck> => {
  if (typeof seriesDeckId === undefined) {
    return Promise.reject(new Error('Invalid id'))
  }
  const res = await axios.get(`series_decks/${seriesDeckId}`)
  return {
    ...res.data,
    // FIXME: レスポンスのidが数値になっていて、queryKey等に影響が出てしまうのでのでキャストしてる
    // ex. ['series-deck', 33] ['series-deck', "33"] は別のキャッシュとして扱われる
    id: `${res.data.id}`
  }
}

export const useSeriesDeck = (seriesDeckId: string | undefined) =>
  useQuery(['series-deck', seriesDeckId], () => getSeriesDeck(seriesDeckId), {
    enabled: Boolean(seriesDeckId)
  })
