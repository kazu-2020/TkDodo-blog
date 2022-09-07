import { SameAs } from './same_as'
import { Role } from './role'
import { ImageHash } from './image_hash'
import { EpisodeData } from './episode_data'
import { Citation } from './citation'
import { Article } from './article'

export type Playlist = {
  id?: string
  playlistUId: string // FIXME: playlistUid
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
  primaryLight: string
  primaryDark: string
  textLight: string
  textDark: string
  linkLight: string
  linkDark: string
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
  howtoCount?: number
  eventCount?: number
  faqpageCount?: number
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
  actor: Array<Role>
  contributor: Array<Role>
  article: Article
  layoutPattern: string
  publishLevel: string
  dateCreated: string
  dateModified: string
  tvepisodeCount: number
}
