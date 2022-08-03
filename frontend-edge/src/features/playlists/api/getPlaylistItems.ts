import { useQuery } from 'react-query'

import { EpisodeData } from '@/types/episode_data'
import axios from '@/lib/axios'

export const getPlaylistItems = async (
  playlistUId: string | undefined
): Promise<EpisodeData[]> => {
  if (typeof playlistUId === undefined) {
    return Promise.reject(new Error('Invalid id'))
  }

  const res = await axios.get(`playlists/${playlistUId}/playlist_items`)
  return res.data.items
}

export const usePlaylistItems = (playlistUId: string | undefined) =>
  useQuery(
    ['playlist_items', playlistUId],
    () => getPlaylistItems(playlistUId),
    {
      enabled: Boolean(playlistUId)
    }
  )
