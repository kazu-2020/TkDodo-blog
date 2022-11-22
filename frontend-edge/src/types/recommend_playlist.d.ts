import { OutputData } from '@editorjs/editorjs'

import { EpisodeData } from '@/types/episode_data'

import { ImageHash } from './image_hash'

export type RecommendPlaylist = {
  primaryId: number
  id?: string
  playlistUId: string
  stringId: string
  seriesId: string
  name: string
  logo: ImageHash
  videos: any[]
  itemNum?: number
  howToCount?: number
  eventCount?: number
  faqPageCount?: number
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
  playableItemsCount?: number
}
