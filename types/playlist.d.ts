import { EpisodeData } from './episode_data'
import { SameAs } from './same_as'

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
  selectedPalette: string
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
  removeLogoImage: boolean
  removeEyecatchImage: boolean
  removeHeroImage: boolean
  items: Array<EpisodeData>
  sameAs: SameAs
  originalSeriesId: string
  aliasId: string
}
