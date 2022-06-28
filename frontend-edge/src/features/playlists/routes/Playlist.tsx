import { useParams } from 'react-router-dom'

import { usePlaylist } from '../api/getPlaylist'

export default function Playlist() {
  const params = useParams()

  const { data, isLoading } = usePlaylist(params.playlistUId)

  if (isLoading) {
    return (
      <main style={{ padding: '1rem' }}>
        <span>Loading...</span>
      </main>
    )
  }

  if (!data) return null

  return (
    <main style={{ padding: '1rem' }}>
      <h2>Playlist Name: {data.name}</h2>
    </main>
  )
}
