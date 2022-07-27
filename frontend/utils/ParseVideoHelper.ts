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

    const hlsVideo = okushibuVideo?.detailedContent || []
    if (hlsVideo.length === 0) {
      return null
    }

    // 社会実証用にvideoUrlを置換する
    // https://github.com/d7lab/dot-editorialhands/issues/53
    return hlsVideo[0].contentUrl
      .replace('stream.media.poc.nhk.jp', 'stream.media.b-poc.nhk.jp')
      .replace('/mp4cenc/', '/mp4/')
  }
}
