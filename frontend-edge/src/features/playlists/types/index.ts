import { OptionBase } from 'chakra-react-select'
import { OutputData } from '@editorjs/editorjs'

import { SameAs } from '@/types/same_as'
import { EpisodeData } from '@/types/episode_data'
import { Citation } from '@/types/citation'

export interface SelectOption extends OptionBase {
  label: string
  value: string
}

export type PlaylistFormInputs = {
  name: string
  detailedNameRuby?: string
  detailedCatch?: string
  description?: string
  keywords: SelectOption[]
  hashtags: SelectOption[]
  formatGenreCode?: string
  themeGenreCode?: string
  selectedPalette: string
  primaryLightColor: string
  primaryDarkColor: string
  linkLightColor: string
  linkDarkColor: string
  aliasId?: string
  sameAsAttributes?: SameAs[]
  citationsAttributes?: Citation[]
  apiState: boolean
  logoImageSrc: string
  eyecatchImageSrc: string
  heroImageSrc: string
  editorData: OutputData
  markedHeader?: string
  markedFooter?: string
  authorType: string
  authorName: string
  publisherName: string
  publisherType: string
  episodes: EpisodeData[]
  activeTvepisode?: boolean
  activeArticle?: boolean
  activeFaqpage?: boolean
  activeHowto?: boolean
  activeEvent?: boolean
  activeRecipe?: boolean
  activeItemList?: boolean
}

export type CreatePlaylistParams = {
  name?: string
  detailedNameRuby?: string
  description?: string
  headline?: string
  detailedCatch?: string
  formatGenreCode?: string
  themeGenreCode?: string
  logoImage?: string
  eyecatchImage?: string
  heroImage?: string
  selectedPalette?: string
  primaryLightColor?: string
  primaryDarkColor?: string
  textLightColor?: string
  textDarkColor?: string
  linkLightColor?: string
  linkDarkColor?: string
  activeTvepisode?: boolean
  activeArticle?: boolean
  activeFaqpage?: boolean
  activeHowto?: boolean
  activeEvent?: boolean
  activeRecipe?: boolean
  activeItemList?: boolean
  aliasId?: string
  markedHeader?: string
  editorData?: Object
  markedFooter?: string
  authorType?: string
  authorName?: string
  publisherType?: string
  publisherName?: string
  apiState?: string
  withEpisodeCount?: number
  sameAsAttributes?: SameAs[]
  citationsAttributes?: Citation[]
  items?: string[]
  keywords?: string[]
  hashtags?: string[]
}

export type UpdatePlaylistParams = CreatePlaylistParams & {
  removeLogoImage?: boolean
  removeEyecatchImage?: boolean
  removeHeroImage?: boolean
  enableListUpdate?: number
}
