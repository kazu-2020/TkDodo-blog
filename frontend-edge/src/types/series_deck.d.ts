import { SeriesPlaylist } from './series_playlist'

export type SeriesDeck = {
  id: string
  name: string
  description?: string
  interfix: string
  stringId: string
  deckUid: string
  adminMemo?: string
  apiState: 'open' | 'close' | 'waiting'
  playlistCount: number
  playlists: SeriesPlaylist[]
  dateCreated: string
  dateModified: string
}
