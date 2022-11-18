import { OutputData } from '@editorjs/editorjs'

import { EpisodeData } from './episode_data'
// TODO: このクラス消す
export type Article = {
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
}
