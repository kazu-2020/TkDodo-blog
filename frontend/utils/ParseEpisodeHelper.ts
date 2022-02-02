import { EpisodeData } from '@/types/episode_data'

export default class {
  static hasVideo(episode: EpisodeData) {
    const videos = episode?.videos || []
    const okushibuVideo = videos.find(
      (video: any) =>
        video.detailedContentStatus?.environmentId === 'okushibu' &&
        video.detailedContentStatus?.contentStatus === 'ready'
    )
    return !!okushibuVideo
  }
}
