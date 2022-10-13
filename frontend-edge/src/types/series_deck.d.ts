import { SeriesPlaylist } from './series_playlist'

export type SeriesDeck = {
  id: string
  name: string
  description?: string
  interfix: string
  stringId: string
  adminMemo?: string
  playlistCount: number
  playlists: SeriesPlaylist[]
  dateCreated: string
  dateModified: string
} & ApiState
