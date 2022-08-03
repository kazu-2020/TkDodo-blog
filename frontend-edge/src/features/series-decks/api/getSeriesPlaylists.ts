import { useInfiniteQuery } from 'react-query'

import { SeriesPlaylist } from '@/types/series_playlist'
import axios from '@/lib/axios'

type Response = {
  result: SeriesPlaylist[]
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

export const getSeriesPlaylists = async (params: Params): Promise<Response> => {
  const res = await axios.get('/series_playlists/search', {
    params: {
      [params.queryKey]: params.query,
      offset: params.offset,
      size: params.size
    }
  })
  return res.data
}

export const useSearchSeriesPlaylists = (params: Params) =>
  useInfiniteQuery<Response, Error>(
    ['search-series-playlists', params],
    ({ pageParam = 0 }) => getSeriesPlaylists({ ...params, offset: pageParam }),
    {
      enabled: params.isSearched,
      getNextPageParam: (lastPage) => {
        if (!lastPage?.nextUrl) return undefined

        const offset = new URL(lastPage.nextUrl).searchParams.get('offset')
        return offset ?? undefined
      }
    }
  )
