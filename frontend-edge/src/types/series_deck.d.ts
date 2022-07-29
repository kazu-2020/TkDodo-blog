import { SeriesPlaylist } from './series_playlist'

export type SeriesDeck = {
  id: string
  name: string
  description?: string
  interfix: string
  stringId: string
  adminMemo?: string
  apiState: 'open' | 'close' | 'waiting'
  playlists: SeriesPlaylist[]
}
