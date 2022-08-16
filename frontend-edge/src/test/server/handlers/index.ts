import { seriesPlaylistsHandlers } from './seriesPlaylists'
import { seriesDecksHandlers } from './seriesDecks'

export const handlers = [...seriesDecksHandlers, ...seriesPlaylistsHandlers]
