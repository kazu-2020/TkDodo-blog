import { useQuery } from '@tanstack/react-query'

import { Playlist } from '@/types/playlist'
import { Pagination } from '@/types/pagination'
import axios from '@/lib/axios'

type Response = {
  playlists: Playlist[]
  pagination: Pagination
}

type Params = {
  query?: string
  apiState?: string
  page?: number
}

export const getPlaylists = async (params: Params): Promise<Response> => {
  const res = await axios.get('/playlists', {
    params: {
      query: params.query,
      api_state: params.apiState,
      page: params.page
    }
  })
  return res.data
}

export const usePlaylists = (params: Params) =>
  useQuery<Response, Error>(['playlist', params], () => getPlaylists(params), {
    keepPreviousData: true
  })
