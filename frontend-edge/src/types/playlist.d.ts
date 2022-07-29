import { SameAs } from './same_as'
import { PlaylistStyle } from './playlist_style'
import { ImageHash } from './image_hash'
import { EpisodeData } from './episode_data'
import { Citation } from './citation'
import { Article } from './article'

export interface Playlist {
  id?: string
  playlistUId: string
  stringId: string
  primaryId: string
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
  apiState: string
  reservePublishTimeAt: string
  reserveFinishTimeAt: string
  logoImageData: string
  eyecatchImageData: string
  heroImageData: string
  logo: ImageHash
  eyecatch: ImageHash
  hero: ImageHash
  removeLogoImage: boolean
  removeEyecatchImage: boolean
  removeHeroImage: boolean
  playableItemsCount?: number
  howToCount?: number
  eventCount?: number
  faqPageCount?: number
  hasHowTo: boolean
  hasEvent: boolean
  hasFaqPage: boolean
  activeItemList: boolean
  activeEpisode: boolean
  activeArticle: boolean
  activeHowTo: boolean
  activeEvent: boolean
  activeFaqPage: boolean
  items: Array<EpisodeData>
  sameAs: Array<SameAs>
  citations: Array<Citation>
  aliasId: string
  actor: Array<Object>
  contributor: Array<Object>
  article: Article
  layoutPattern: string
  publishLevel: string
  dateCreated: string
  dateModified: string
  itemNum: number
  style: PlaylistStyle
}
