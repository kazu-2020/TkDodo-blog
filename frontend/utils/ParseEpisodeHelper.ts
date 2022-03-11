import { EpisodeData } from '@/types/episode_data'

export default class {
  static isOkushibuVideo(video: any) {
    return (
      video.detailedContentStatus?.environmentId === 'okushibu' &&
      video.detailedContentStatus?.contentStatus === 'ready'
    )
  }

  static hasVideo(episode: EpisodeData) {
    const videos = episode?.videos || []
    const okushibuVideo = videos.find((video: any) =>
      this.isOkushibuVideo(video)
    )
    return !!okushibuVideo
  }

  static videoUrl(episode: EpisodeData) {
    const videos = episode?.videos || []
    const okushibuVideo: any = videos.find((video: any) =>
      this.isOkushibuVideo(video)
    )

    const hlsVideo = (okushibuVideo?.detailedContent || []).find(
      (v: any) => v.name === 'hls_fmp4'
    )
    return hlsVideo?.contentUrl
  }
}
