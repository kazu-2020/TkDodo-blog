import { useQuery } from 'react-query'

import { Playlist } from '@/types/playlist'
import axios from '@/lib/axios'

export const getEpisodePlaylist = async (
  episodeId: string | undefined
): Promise<Playlist[]> => {
  if (typeof episodeId === undefined) {
    return Promise.reject(new Error('Invalid id'))
  }

  const res = await axios.get(`episodes/${episodeId}/playlists`)
  return res.data.playlists
}

export const useEpisodePlaylist = (episodeId: string | undefined) =>
  useQuery(
    ['episodes-playlist', episodeId],
    () => getEpisodePlaylist(episodeId),
    {}
  )
