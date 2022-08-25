import { useQuery } from 'react-query'

import { RecommendDeck } from '@/types/recommend_deck'
import axios from '@/lib/axios'

export const getRecommendDeck = async (
  recommendDeckId: string | undefined
): Promise<RecommendDeck> => {
  if (typeof recommendDeckId === undefined) {
    return Promise.reject(new Error('Invalid id'))
  }
  const res = await axios.get(`decks/${recommendDeckId}`, {
    params: {
      with_episode_count: 1
    }
  })
  return res.data.deck
}

export const useRecommendDeck = (recommendDeckId: string | undefined) =>
  useQuery(
    ['recommend-deck', recommendDeckId],
    () => getRecommendDeck(recommendDeckId),
    {
      enabled: Boolean(recommendDeckId)
    }
  )
