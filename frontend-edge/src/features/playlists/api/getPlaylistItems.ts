import { useQuery } from 'react-query'

import { EpisodeData } from '@/types/episode_data'
import axios from '@/lib/axios'

export const getPlaylistItems = async (
  playlistUid: string | undefined
): Promise<EpisodeData[]> => {
  if (typeof playlistUid === undefined) {
    return Promise.reject(new Error('Invalid id'))
  }

  const res = await axios.get(`playlists/${playlistUid}/playlist_items`)
  return res.data.items
}

export const usePlaylistItems = (playlistUid: string | undefined) =>
  useQuery(
    ['playlist-items', playlistUid],
    () => getPlaylistItems(playlistUid),
    {
      enabled: Boolean(playlistUid),
      useErrorBoundary: false
    }
  )
