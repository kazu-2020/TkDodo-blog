// 20220727時点でプレイリスト検索がr6.0 にしかないので、r7 ができるまでokushibu3も参照しています
// 社会実証2期に向けてVideoObjectの参照先を変更する場合修正が必要になることに注意してください
// https://github.com/d7lab/aw-editorialhands/issues/1365
import { VideoObject } from '@/types/video_object'

export const isOkushibuVideo = (video: VideoObject) =>
  (video.detailedContentStatus?.environmentId === 'okushibu' ||
    video.detailedContentStatus?.environmentId === 'okushibu3') &&
  video.detailedContentStatus?.contentStatus === 'ready'

export const hasVideo = (videos: VideoObject[]) => {
  const okushibuVideo = videos.find((video: VideoObject) =>
    isOkushibuVideo(video)
  )
  return !!okushibuVideo
}

export const videoUrl = (videos: VideoObject[]) => {
  const okushibuVideo: any = videos.find((video: any) => isOkushibuVideo(video))

  const hlsVideo = okushibuVideo?.detailedContent || []
  if (hlsVideo.length === 0) {
    return null
  }

  return hlsVideo[0].contentUrl
}
