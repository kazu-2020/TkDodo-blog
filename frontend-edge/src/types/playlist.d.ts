import { OutputData } from '@editorjs/editorjs'

import { AvailableEpisodes } from '@/types/series_data'

import { SameAs } from './same_as'
import { Role } from './role'
import { ImageHash } from './image_hash'
import { EpisodeData, PartOfSeries } from './episode_data'
import { Citation } from './citation'

export type Playlist = {
  id?: string
  playlistUid: string
  stringId: string
  primaryId: number
  name: string
  detailedNameRuby: string
  description: string
  keywords: string[]
  detailedCatch: string
  hashtags: string[]
  formatGenreCode: string
  formatGenreName?: string
  themeGenreCode: string
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
  itemNum: number
  howtoCount?: number
  eventCount?: number
  faqpageCount?: number
  hasHowTo: boolean
  hasEvent: boolean
  hasFaqPage: boolean
  activeItemList: boolean
  activeTvepisode: boolean
  activeArticle: boolean
  activeHowto: boolean
  activeEvent: boolean
  activeFaqpage: boolean
  activeRecipe: boolean
  items: Array<EpisodeData>
  sameAs: Array<SameAs>
  citations: Array<Citation>
  aliasId: string
  actor: Array<Role>
  contributor: Array<Role>
  markedHeader?: string
  editorData?: OutputData
  markedFooter?: string
  articleBody?: string
  markedBody?: string
  authorType?: string
  authorName?: string
  publisherType?: string
  publisherName?: string
  articleContainsEpisodes?: Array<EpisodeData>
  layoutPattern: string
  publishLevel: string
  dateCreated: string
  dateModified: string
  tvepisodeCount: number
  keyvisuals?: Array<ImageHash>
  partOfSeries?: PartOfSeries
  availableEpisodes?: AvailableEpisodes
  videos: any[]
}
