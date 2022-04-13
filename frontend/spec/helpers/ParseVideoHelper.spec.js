import ParseVideoHelper from '~/utils/ParseVideoHelper'

describe('utils/ParseVideoHelper.ts', () => {
  describe('#videoUrl', () => {
    it('社会実証用に置換されたvideoUrlが取得できること', () => {
      const videos = [
        {
          name: 'オトッペ「お菓子なロマンス」',
          description:
            '世界一のＤＪをめざすシーナと音から生まれたふしぎな生きもの「オトッペ」たちのへんてこな物語！オトッペタウンで大人気のスイートな少女マンガ「お菓子なロマンス」。作者の正体は…？番組アプリから投稿されたオトッペも紹介します！',
          identifierGroup: {
            environmentId: 'okushibu3',
            broadcastEventId: 'e1-130-2022041220811',
            streamType: 'vod',
          },
          detailedContentStatus: {
            environmentId: 'okushibu3',
            streamType: 'vod',
            contentStatus: 'ready',
          },
          detailedContent: [
            {
              name: 'hls_widevine',
              contentUrl:
                'https://stream.media.poc.nhk.jp/e1/130/mp4cenc/2022041220811/master.m3u8',
              lowContentUrl:
                'https://stream.media.poc.nhk.jp/e1/130/mp4cenc/2022041220811/low.m3u8',
              encodingFormat: ['video/mp4', 'vnd.apple.mpegURL'],
              drmName: 'widevine',
              drmLicense: 'https://license.media.poc.nhk.jp/widevine/license',
            },
            {
              name: 'hls_fairplay',
              contentUrl:
                'https://stream.media.poc.nhk.jp/e1/130/mp4cbcs/2022041220811/master.m3u8',
              lowContentUrl:
                'https://stream.media.poc.nhk.jp/e1/130/mp4cbcs/2022041220811/low.m3u8',
              encodingFormat: ['video/mp4', 'vnd.apple.mpegURL'],
              drmName: 'fairplay',
              drmLicense: 'https://license.media.poc.nhk.jp/fps/license',
            },
          ],
        },
      ]

      expect(ParseVideoHelper.videoUrl(videos)).toBe(
        'https://stream.media.b-poc.nhk.jp/e1/130/mp4/2022041220811/master.m3u8'
      )
    })
  })
})
