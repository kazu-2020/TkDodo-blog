import { useQuery } from 'react-query'

import { EpisodeData } from '@/types/episode_data'
import axios from '@/lib/axios'

type Response = {
  episodes: EpisodeData[]
}

type Params = {
  playlistId?: string
}

export const getSeriesPlaylistEpisodes = async (
  params: Params
): Promise<Response> => {
  const res = await axios.get(`/series_playlists/${params.playlistId}/episodes`)
  return res.data
}

export const useSeriesPlaylistEpisodes = (params: Params) =>
  useQuery<Response, Error>(['series-playlist-episodes', params], () =>
    getSeriesPlaylistEpisodes(params)
  )
