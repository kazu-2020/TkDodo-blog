import { recommendDecksHandlers } from '@/test/server/handlers/recommendDecks'
import { bundleItemsHandlers } from '@/test/server/handlers/bundleItems'

import { seriesPlaylistsHandlers } from './seriesPlaylists'
import { seriesDecksHandlers } from './seriesDecks'
import { playlistsHandlers } from './playlists'

export const handlers = [
  ...bundleItemsHandlers,
  ...playlistsHandlers,
  ...seriesDecksHandlers,
  ...recommendDecksHandlers,
  ...seriesPlaylistsHandlers
]
