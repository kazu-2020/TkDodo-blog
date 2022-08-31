import { OutputData } from '@editorjs/editorjs'

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
  logoImageData: string
  eyeCatchImageData: string
  heroImageData: string
  editorData: OutputData
  markedHeader: string
  markedFooter: string
  authorType: string
  authorName: string
  publisherName: string
  publisherType: string
}
