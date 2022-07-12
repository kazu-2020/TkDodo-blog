import { useQuery } from 'react-query'

import { Playlist } from '@/types/playlist'
import axios from '@/lib/axios'

export const getPlaylist = async (
  playlistUId: string | undefined
): Promise<Playlist> => {
  if (typeof playlistUId === undefined) {
    return Promise.reject(new Error('Invalid id'))
  }

  const res = await axios.get(`playlists/${playlistUId}`)
  return res.data.playlist
}

export const usePlaylist = (playlistUId: string | undefined) =>
  useQuery(['playlist', playlistUId], () => getPlaylist(playlistUId), {
    enabled: Boolean(playlistUId)
  })
