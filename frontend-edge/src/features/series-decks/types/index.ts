import { SeriesPlaylist } from '@/types/series_playlist'

export type SeriesDeckFormInputs = {
  name: string
  interfix: string
  description?: string
  apiState: boolean
  playlists?: SeriesPlaylist[]
}
