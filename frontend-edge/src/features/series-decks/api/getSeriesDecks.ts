import { useQuery } from 'react-query'

import { SeriesDeck } from '@/types/series_deck'
import { Pagination } from '@/types/pagination'
import axios from '@/lib/axios'

type Response = {
  seriesDecks: SeriesDeck[]
  pagination: Pagination
}

type Params = {
  query?: string
  apiState?: string
  page?: number
}

export const getSeriesDecks = async (params: Params): Promise<Response> => {
  const res = await axios.get('/series_decks', {
    params: {
      query: params.query,
      api_state: params.apiState,
      page: params.page
    }
  })
  return { seriesDecks: res.data.series_decks, pagination: res.data.pagination }
}

export const useSeriesDecks = (params: Params) =>
  useQuery<Response, Error>(
    ['series-decks', params],
    () => getSeriesDecks(params),
    {
      keepPreviousData: true
    }
  )
