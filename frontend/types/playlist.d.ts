import { EpisodeData } from './episode_data'
import { SameAs } from './same_as'
import { Citation } from './citation'
import { Article } from './article'

export interface Playlist {
  id: string
  originalId: string
  name: string
  detailedNameRuby: string
  description: string
  keywords: string
  detailedCatch: string
  hashtag: string
  formatGenre: string
  formatGenreName?: string
  themeGenre: string
  themeGenreName?: string
  selectedPalette: string
  primaryLightColor: string
  primaryDarkColor: string
  textLightColor: string
  textDarkColor: string
  linkLightColor: string
  linkDarkColor: string
  publishedState?: string
  reservePublishTimeAt: string
  reserveFinishTimeAt: string
  logoImageData: string
  eyecatchImageData: string
  heroImageData: string
  removeLogoImage: boolean
  removeEyecatchImage: boolean
  removeHeroImage: boolean
  browsableItemCount: number
  hasHowTo: boolean
  hasEvent: boolean
  outputEpisodeToBundle: boolean
  outputArticleToBundle: boolean
  outputHowToToBundle: boolean
  outputEventToBundle: boolean
  outputFaqPageToBundle: boolean
  items: Array<EpisodeData>
  sameAs: SameAs
  citations: Array<Citation>
  originalSeriesId: string
  aliasId: string
  actor: Array<Object>
  contributor: Array<Object>
  article: Article
}
