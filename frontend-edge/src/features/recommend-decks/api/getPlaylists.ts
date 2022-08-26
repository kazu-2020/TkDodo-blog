import { useQuery } from 'react-query'

import { RecommendPlaylist } from '@/types/recommend_playlist'
import { Pagination } from '@/types/pagination'
import axios from '@/lib/axios'

type Response = {
  playlists: RecommendPlaylist[]
  pagination: Pagination
}

type Params = {
  per?: number
  withEpisodeCount?: number
}

export const getPlaylists = async (params: Params): Promise<Response> => {
  const res = await axios.get('/playlists', {
    params: {
      per: params.per,
      with_episode_count: params.withEpisodeCount
    }
  })
  return res.data
}

export const usePlaylists = (params: Params) =>
  useQuery<Response, Error>(['playlist', params], () => getPlaylists(params), {
    keepPreviousData: true
  })
