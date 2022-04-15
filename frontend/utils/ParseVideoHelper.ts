export default class {
  static isOkushibuVideo(video: any) {
    return (
      video.detailedContentStatus?.environmentId === 'okushibu' &&
      video.detailedContentStatus?.contentStatus === 'ready'
    )
  }

  static hasVideo(videos: any[]) {
    const okushibuVideo = videos.find((video: any) =>
      this.isOkushibuVideo(video)
    )
    return !!okushibuVideo
  }

  static videoUrl(videos: any[]) {
    const okushibuVideo: any = videos.find((video: any) =>
      this.isOkushibuVideo(video)
    )

    const hlsVideo = (okushibuVideo?.detailedContent || []).find(
      (v: any) => v.name === 'hls_fmp4'
    )
    return hlsVideo?.contentUrl
  }
}
