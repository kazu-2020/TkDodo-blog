import { recommendDecksHandlers } from '@/test/server/handlers/recommendDecks'
import { bundleItemsHandlers } from '@/test/server/handlers/bundleItems'

import { seriesPlaylistsHandlers } from './seriesPlaylists'
import { seriesDecksHandlers } from './seriesDecks'
import { playlistsHandlers } from './playlists'
import { announcementsHandlers } from './announcements'

export const handlers = [
  ...bundleItemsHandlers,
  ...playlistsHandlers,
  ...seriesDecksHandlers,
  ...recommendDecksHandlers,
  ...seriesPlaylistsHandlers,
  ...announcementsHandlers
]
