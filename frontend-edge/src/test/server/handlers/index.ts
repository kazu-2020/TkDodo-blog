import { recommendDecksHandlers } from '@/test/server/handlers/recommendDecks'

import { seriesPlaylistsHandlers } from './seriesPlaylists'
import { seriesDecksHandlers } from './seriesDecks'
import { playlistsHandlers } from './playlists'

export const handlers = [
  ...playlistsHandlers,
  ...seriesDecksHandlers,
  ...recommendDecksHandlers,
  ...seriesPlaylistsHandlers
]
