import { useInfiniteQuery } from 'react-query'

import { RecommendPlaylist } from '@/types/recommend_playlist'
import { Pagination } from '@/types/pagination'
import axios from '@/lib/axios'

type Response = {
  playlists: RecommendPlaylist[]
  pagination: Pagination
}

type Params = {
  query?: string
  page?: number
  per?: number
  withEpisodeCount?: number
}

export const getPlaylists = async (params: Params): Promise<Response> => {
  const res = await axios.get('/playlists', {
    params: {
      query: params.query,
      page: params.page,
      per: params.per,
      with_episode_count: params.withEpisodeCount
    }
  })
  return res.data
}

export const usePlaylists = (params: Params) =>
  useInfiniteQuery<Response, Error>(
    ['playlist', params],
    ({ pageParam = 1 }) => getPlaylists({ ...params, page: pageParam }),
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage) => lastPage?.pagination?.nextPage
    }
  )
