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

if (import.meta.vitest) {
  const { videoGenerator } = await import('@/test/data-generators')

  const { describe, it, expect } = import.meta.vitest
  describe('isOkushibuVideo', () => {
    describe('statusがready', () => {
      it('okushibuの場合', () => {
        const video = videoGenerator({
          detailedContentStatus: {
            environmentId: 'okushibu',
            contentStatus: 'ready'
          }
        })
        expect(isOkushibuVideo(video)).toBeTruthy()
      })
      it('okushibu3の場合', () => {
        const video = videoGenerator({
          detailedContentStatus: {
            environmentId: 'okushibu3',
            contentStatus: 'ready'
          }
        })
        expect(isOkushibuVideo(video)).toBeTruthy()
      })
      it('それ以外場合', () => {
        const video = videoGenerator({
          detailedContentStatus: {
            environmentId: 'xxxxxxx',
            contentStatus: 'ready'
          }
        })
        expect(isOkushibuVideo(video)).toBeFalsy()
      })
    })

    describe('statusがready以外', () => {
      it('okushibuの場合', () => {
        const video = videoGenerator({
          detailedContentStatus: {
            environmentId: 'okushibu',
            contentStatus: 'xxxxx'
          }
        })
        expect(isOkushibuVideo(video)).toBeFalsy()
      })
      it('okushibu3の場合', () => {
        const video = videoGenerator({
          detailedContentStatus: {
            environmentId: 'okushibu3',
            contentStatus: 'xxxxx'
          }
        })
        expect(isOkushibuVideo(video)).toBeFalsy()
      })
      it('それ以外場合', () => {
        const video = videoGenerator({
          detailedContentStatus: {
            environmentId: 'xxxxxxx',
            contentStatus: 'xxxxx'
          }
        })
        expect(isOkushibuVideo(video)).toBeFalsy()
      })
    })
  })

  describe('hasVideo', () => {
    it('対象のvideoが含まれている場合', () => {
      const videos = [
        videoGenerator({
          detailedContentStatus: {
            environmentId: 'okushibu3',
            contentStatus: 'ready'
          }
        }),
        videoGenerator({
          detailedContentStatus: {
            environmentId: 'xxxxxxx',
            contentStatus: 'xxxxx'
          }
        })
      ]

      expect(hasVideo(videos)).toBeTruthy()
    })

    it('対象のvideoが含まれていない場合', () => {
      const videos = [
        videoGenerator({
          detailedContentStatus: {
            environmentId: 'xxxxxxx',
            contentStatus: 'ready'
          }
        }),
        videoGenerator({
          detailedContentStatus: {
            environmentId: 'xxxxxxx',
            contentStatus: 'xxxxx'
          }
        })
      ]

      expect(hasVideo(videos)).toBeFalsy()
    })
  })

  describe('videoUrl', () => {
    it('有効なvideoのUrlが返却される', () => {
      const video = videoGenerator({
        detailedContentStatus: {
          environmentId: 'okushibu3',
          contentStatus: 'ready'
        },
        detailedContent: [
          { name: 'test', contentUrl: 'test-url1', encodingFormat: [] },
          { name: 'test', contentUrl: 'test-url2', encodingFormat: [] }
        ]
      })
      expect(videoUrl([video])).toEqual('test-url1')
    })

    it('nullが返却される', () => {
      const video = videoGenerator({
        detailedContentStatus: {
          environmentId: 'okushibu3',
          contentStatus: 'ready'
        },
        detailedContent: []
      })
      expect(videoUrl([video])).toBeNull()
    })
  })
}
