import { useQuery } from 'react-query'

import { SeriesDeck } from '@/types/series_deck'
import axios from '@/lib/axios'

export const getSeriesDecks = async (): Promise<SeriesDeck[]> => {
  const res = await axios.get('/series_decks')
  return res.data.series_decks
}

export const useSeriesDecks = () =>
  useQuery<SeriesDeck[], Error>('series-decks', getSeriesDecks)
