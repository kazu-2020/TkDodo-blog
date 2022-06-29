import { useQuery } from 'react-query'

import { Deck as SeriesDeck } from '@/types/deck'
import axios from '@/lib/axios'

export const getSeriesDecks = async (): Promise<SeriesDeck[]> => {
  const res = await axios.get('/series_decks')
  return res.data.playlists
}

export const useSeriesDecks = () =>
  useQuery<SeriesDeck[], Error>('series_decks', getSeriesDecks)
