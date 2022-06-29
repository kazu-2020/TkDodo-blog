import { useQuery } from 'react-query'

import { Deck as RecommendDeck } from '@/types/deck'
import axios from '@/lib/axios'

export const getRecommendDecks = async (): Promise<RecommendDeck[]> => {
  const res = await axios.get('/recommend_decks')
  return res.data.playlists
}

export const useRecommendDecks = () =>
  useQuery<RecommendDeck[], Error>('recommend_decks', getRecommendDecks)
