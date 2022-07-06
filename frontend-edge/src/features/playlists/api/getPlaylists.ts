import { useQuery } from 'react-query'

import { Playlist } from '@/types/playlist'
import axios from '@/lib/axios'

export const getPlaylists = async (): Promise<Playlist[]> => {
  const res = await axios.get('/playlists')
  return res.data.playlists
}

export const usePlaylists = () =>
  useQuery<Playlist[], Error>('playlist', getPlaylists)
