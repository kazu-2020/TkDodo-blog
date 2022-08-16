import { EpisodeData } from './episode_data'

export type SeriesStyle = {
  textLight?: string
  textDark?: string
  linkLight?: string
  linkDark?: string
  primaryLight?: string
  primaryDark?: string
}

export type SeriesData = {
  style: SeriesStyle
  episodes: Array<EpisodeData>
}
