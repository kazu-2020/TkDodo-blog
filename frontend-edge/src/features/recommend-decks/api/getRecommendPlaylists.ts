import { useInfiniteQuery } from 'react-query'

import { RecommendPlaylist } from '@/types/recommend_playlist'
import axios from '@/lib/axios'

type Response = {
  result: RecommendPlaylist[]
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

export const getRecommendPlaylists = async (
  params: Params
): Promise<Response> => {
  const res = await axios.get('/series_playlists/search', {
    params: {
      [params.queryKey]: params.query,
      offset: params.offset,
      size: params.size
    }
  })
  return res.data
}

export const useSearchRecommendPlaylists = (params: Params) =>
  useInfiniteQuery<Response, Error>(
    ['search-series-playlists', params],
    ({ pageParam = 0 }) =>
      getRecommendPlaylists({ ...params, offset: pageParam }),
    {
      enabled: params.isSearched,
      getNextPageParam: (lastPage) => {
        if (!lastPage?.nextUrl) return undefined

        const offset = new URL(lastPage.nextUrl).searchParams.get('offset')
        return offset ?? undefined
      }
    }
  )
