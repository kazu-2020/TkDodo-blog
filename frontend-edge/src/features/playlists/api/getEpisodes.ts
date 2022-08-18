import { useInfiniteQuery } from 'react-query'

import { EpisodeData } from '@/types/episode_data'
import axios from '@/lib/axios'

type Response = {
  result: EpisodeData[]
  nextUrl: string
  prevUrl: string
  count: number
}

type Params = {
  query?: string
  queryKey: string
  offset?: number
  size?: number
  isSearched?: boolean
}

export const getEpisodes = async (params: Params): Promise<Response> => {
  const res = await axios.get('/episodes/search', {
    params: {
      [params.queryKey]: params.query,
      offset: params.offset,
      size: params.size
    }
  })
  return res.data
}

export const useSearchEpisodes = (params: Params) =>
  useInfiniteQuery<Response, Error>(
    ['search-episodes', params],
    ({ pageParam = 0 }) => getEpisodes({ ...params, offset: pageParam }),
    {
      enabled: params.isSearched,
      getNextPageParam: (lastPage) => {
        if (!lastPage?.nextUrl) return undefined

        const offset = new URL(lastPage.nextUrl).searchParams.get('offset')
        return offset ?? undefined
      }
    }
  )
