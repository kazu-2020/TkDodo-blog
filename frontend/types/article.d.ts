import { EpisodeData } from './episode_data'

export interface Article {
  header?: string
  body?: string
  footer?: string
  plainBody?: string
  authorType?: string
  authorName?: string
  publisherType?: string
  publisherName?: string
  containsEpisodes?: Array<EpisodeData>
}
