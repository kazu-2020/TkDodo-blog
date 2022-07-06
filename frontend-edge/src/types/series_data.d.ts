import { EpisodeData } from './episode_data'

export interface SeriesStyle {
  textLight?: string
  textDark?: string
  linkLight?: string
  linkDark?: string
  primaryLight?: string
  primaryDark?: string
}

export interface SeriesData {
  style: SeriesStyle
  episodes: Array<EpisodeData>
}
