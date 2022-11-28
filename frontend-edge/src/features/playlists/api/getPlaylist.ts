import { useQuery } from 'react-query'

import { Playlist } from '@/types/playlist'
import axios from '@/lib/axios'

export const getPlaylist = async (
  playlistUid: string | undefined
): Promise<Playlist> => {
  if (typeof playlistUid === undefined) {
    return Promise.reject(new Error('Invalid id'))
  }

  const res = await axios.get(`playlists/${playlistUid}`)
  return res.data
}

export const usePlaylist = (playlistUid: string | undefined) =>
  useQuery(['playlist', playlistUid], () => getPlaylist(playlistUid), {
    enabled: Boolean(playlistUid)
  })
