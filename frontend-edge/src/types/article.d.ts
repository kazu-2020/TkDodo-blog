import { EpisodeData } from './episode_data'

export type Article = {
  header?: string
  body?: string
  footer?: string
  plainBody?: string
  markedBody?: string
  authorType?: string
  authorName?: string
  publisherType?: string
  publisherName?: string
  containsEpisodes?: Array<EpisodeData>
}
