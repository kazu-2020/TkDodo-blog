import { Link } from 'react-router-dom'

import { Playlist } from '@/types/playlist'

import { usePlaylists } from '../api/getPlaylists'

export default function Playlists() {
  const { data, isLoading } = usePlaylists()

  if (isLoading) {
    return <span>Loading...</span>
  }

  return (
    <ul>
      {data?.map((playlist: Playlist) => (
        <li key={playlist.playlistUId}>
          <Link to={`/playlists/${playlist.playlistUId}`}>{playlist.name}</Link>
        </li>
      ))}
    </ul>
  )
}
