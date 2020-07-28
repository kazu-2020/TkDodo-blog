import { EpisodeData } from './episode_data'

export interface Playlist {
  id: string
  name: string
  detailedNameRuby: string
  description: string
  keywords: string
  detailedCatch: string
  hashtag: string
  formatGenre: string
  themeGenre: string
  selectedPaletteColor: string
  primaryLightColor: string
  primaryDarkColor: string
  textLightColor: string
  textDarkColor: string
  linkLightColor: string
  linkDarkColor: string
  reservePublishTimeAt: string
  reserveFinishTimeAt: string
  logoImageData: string
  eyecatchImageData: string
  heroImageData: string
  items: Array<EpisodeData>
}
