import { useQuery } from '@tanstack/react-query'

import { EpisodeData } from '@/types/episode_data'
import axios from '@/lib/axios'

type Params = {
  playlistUid?: string
  limit?: number
  enabled?: boolean
}

export const getPlaylistItems = async (
  params: Params
): Promise<EpisodeData[]> => {
  if (typeof params.playlistUid === undefined) {
    return Promise.reject(new Error('Invalid id'))
  }

  const res = await axios.get(
    `playlists/${params.playlistUid}/playlist_items`,
    {
      params: {
        limit: params.limit
      }
    }
  )
  return res.data.items
}

export const usePlaylistItems = (params: Params) =>
  useQuery(
    ['recommend-deck-playlist-items', params],
    () => getPlaylistItems(params),
    {
      enabled: params.enabled === false ? false : Boolean(params.playlistUid)
    }
  )
