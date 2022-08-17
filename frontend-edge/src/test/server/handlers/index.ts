import { seriesPlaylistsHandlers } from './seriesPlaylists'
import { seriesDecksHandlers } from './seriesDecks'
import { playlistsHandlers } from './playlists'

export const handlers = [
  ...playlistsHandlers,
  ...seriesDecksHandlers,
  ...seriesPlaylistsHandlers
]
