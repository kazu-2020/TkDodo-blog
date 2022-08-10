import { useQuery } from 'react-query'

import { RecommendDeck } from '@/types/recommend_deck'
import { Pagination } from '@/types/pagination'
import axios from '@/lib/axios'

type Response = {
  recommendDecks: RecommendDeck[]
  pagination: Pagination
}

type Params = {
  query?: string
  apiState?: string
  page?: number
}

export const getRecommendDecks = async (params: Params): Promise<Response> => {
  const res = await axios.get('/decks', {
    params: {
      query: params.query,
      api_state: params.apiState,
      page: params.page
    }
  })
  return {
    recommendDecks: res.data.decks,
    pagination: res.data.pagination
  }
}

export const useRecommendDecks = (params: Params) =>
  useQuery<Response, Error>(
    ['recommend-decks', params],
    () => getRecommendDecks(params),
    {
      keepPreviousData: true
    }
  )
