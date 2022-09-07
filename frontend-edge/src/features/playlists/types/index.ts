import { OutputData } from '@editorjs/editorjs'

import { EpisodeData } from '@/types/episode_data'

// TODO
export type PlaylistFormInputs = {
  name: string
  detailedNameRuby: string
  detailedCatch: string
  description: string
  keywords: string
  hashtags: string
  formatGenre: string
  themeGenre: string
  selectedPalette: string
  primaryLight: string
  primaryDark: string
  linkLight: string
  linkDark: string
  aliasId: string
  // sameAs: Object[]
  // citations: Object[]
  apiState: boolean
  // selectedTypes: string[]
  tvepisodeCount: number
  faqpageCount: number
  howtoCount: number
  eventCount: number
  logoImageSrc: string
  eyecatchImageSrc: string
  heroImageSrc: string
  editorData: OutputData
  markedHeader: string
  markedFooter: string
  authorType: string
  authorName: string
  publisherName: string
  publisherType: string
  episodes: EpisodeData[]
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
  sameAsAttributes?: []
  citationsAttributes?: []
  playlistItemsAttributes?: []
  keywords?: string[]
  hashtags?: string[]
  episodeIds?: string[]
}

export type UpdatePlaylistParams = CreatePlaylistParams & {
  removeLogoImage?: boolean
  removeEyecatchImage?: boolean
  removeHeroImage?: boolean
  enableListUpdate?: boolean
}
