import { SeriesPlaylist } from '@/types/series_playlist'
import { SeriesData } from '@/types/series_data'
import { Playlist } from '@/types/playlist'
import { EpisodeData } from '@/types/episode_data'

export const dummyImageUrl = (dateTime: string, imageType: string) => {
  const num = Number(new Date(dateTime).getUTCDate() % 10) + 1 || 1
  return `/dummy/default${num}/default${num}-${imageType}.png`
}

export const episodeThumbnailUrl = (
  episodeItem: EpisodeData,
  defaultImage?: string
) => {
  if (episodeItem?.eyecatch?.medium?.url !== undefined) {
    return episodeItem.eyecatch?.medium?.url
  }
  if (
    episodeItem?.keyvisuals !== undefined &&
    episodeItem?.keyvisuals[0]?.small?.url
  ) {
    return episodeItem?.keyvisuals[0]?.small?.url
  }
  if (episodeItem?.partOfSeries?.eyecatch !== undefined) {
    return episodeItem?.partOfSeries?.eyecatch?.medium?.url
  }

  return defaultImage === undefined ? '' : defaultImage
}

export const playlistLogoUrl = (
  playlist: Playlist | SeriesPlaylist,
  defaultImageUrl = '/public/dummy/default1/default1-logo.png'
) => playlist.logo?.medium?.url ?? defaultImageUrl

export const expansionLogoUrl = (item: Playlist | SeriesData) => {
  if (item.logo?.medium?.url !== undefined) {
    return item.logo?.medium?.url
  }

  if (
    item.keyvisuals !== undefined &&
    item.keyvisuals[0]?.small?.url !== undefined
  ) {
    return item.keyvisuals[0]?.small?.url
  }

  if (item.partOfSeries?.logo?.medium?.url !== undefined) {
    return item.partOfSeries?.logo?.medium?.url
  }

  return 'https://placehold.jp/40x40.png'
}

if (import.meta.vitest) {
  const { episodeDataGenerator, playlistGenerator } = await import(
    '@/test/data-generators'
  )

  const { describe, it, expect } = import.meta.vitest
  describe('dummyImageUrl', () => {
    it('日付を元にしたダミー画像のパスが生成されること', () => {
      expect(dummyImageUrl('2022-01-02 23:04:05', 'test')).toEqual(
        '/dummy/default3/default3-test.png'
      )
    })
  })

  describe('episodeThumbnailUrl', () => {
    it('eyecatch画像がある場合', () => {
      const episode = episodeDataGenerator({
        eyecatch: { medium: { url: 'test.png', width: 1, height: 1 } }
      })
      expect(episodeThumbnailUrl(episode)).toEqual('test.png')
    })

    it('keyvisual画像がある場合', () => {
      const episode = episodeDataGenerator({
        keyvisuals: [
          { small: { url: 'test1.png', width: 1, height: 1 } },
          { small: { url: 'test2.png', width: 1, height: 1 } }
        ]
      })
      expect(episodeThumbnailUrl(episode)).toEqual('test1.png')
    })

    it('partOfSeries画像がある場合', () => {
      const episode = episodeDataGenerator({
        partOfSeries: {
          eyecatch: { medium: { url: 'test.png', width: 1, height: 1 } }
        }
      })
      expect(episodeThumbnailUrl(episode)).toEqual('test.png')
    })

    it('何も画像がない場合', () => {
      const episode = episodeDataGenerator({
        eyecatch: undefined,
        keyvisual: [],
        partOfSeries: undefined
      })
      expect(episodeThumbnailUrl(episode)).toEqual('')

      expect(episodeThumbnailUrl(episode, 'default.png')).toEqual('default.png')
    })
  })

  describe('playlistLogoUrl', () => {
    it('ロゴ画像が定義されてる場合', () => {
      const playlist = playlistGenerator({
        logo: { medium: { url: 'dummy.jpg', width: 1, height: 1 } }
      })
      expect(
        playlistLogoUrl(playlist, '/public/dummy/default1/default1-logo.png')
      ).toEqual('dummy.jpg')
    })

    it('ロゴ画像が定義されていない場合', () => {
      const playlist = playlistGenerator({
        logo: { medium: { url: undefined, width: 1, height: 1 } }
      })
      expect(
        playlistLogoUrl(playlist, '/public/dummy/default1/default1-logo.png')
      ).toEqual('/public/dummy/default1/default1-logo.png')
    })

    it('ロゴ画像が定義されていない場合にデフォルトを指定したとき', () => {
      const playlist = playlistGenerator({
        logo: { medium: { url: undefined, width: 1, height: 1 } }
      })
      expect(
        playlistLogoUrl(playlist, '/public/dummy/default1/default2-logo.png')
      ).toEqual('/public/dummy/default1/default2-logo.png')
    })
  })

  describe('expansionLogoUrl', () => {
    it('logoが設定されている場合', () => {
      const playlist = playlistGenerator({
        logo: { medium: { url: 'logo.jpg', width: 1, height: 1 } }
      })
      expect(expansionLogoUrl(playlist)).toEqual('logo.jpg')
    })

    it('keyvisualsが設定されている場合', () => {
      const playlist = playlistGenerator({
        keyvisuals: [
          { small: { url: 'keylogo1.jpg', width: 1, height: 1 } },
          { small: { url: 'keylogo2.jpg', width: 1, height: 1 } }
        ]
      })
      expect(expansionLogoUrl(playlist)).toEqual('keylogo1.jpg')
    })

    it('partOfSeries.logoが設定されている場合', () => {
      const playlist = playlistGenerator({
        partOfSeries: {
          name: 'test',
          logo: { medium: { url: 'partlogo.jpg', width: 1, height: 1 } }
        }
      })
      expect(expansionLogoUrl(playlist)).toEqual('partlogo.jpg')
    })

    it('すべて設定されていない場合', () => {
      const playlist = playlistGenerator()
      expect(expansionLogoUrl(playlist)).toEqual(
        'https://placehold.jp/40x40.png'
      )
    })

    it('すべて設定されている場合', () => {
      const playlist = playlistGenerator({
        logo: { medium: { url: 'logo.jpg', width: 1, height: 1 } },
        keyvisuals: [
          { small: { url: 'keylogo1.jpg', width: 1, height: 1 } },
          { small: { url: 'keylogo2.jpg', width: 1, height: 1 } }
        ],
        partOfSeries: {
          name: 'test',
          logo: { medium: { url: 'partlogo.jpg', width: 1, height: 1 } }
        }
      })
      expect(expansionLogoUrl(playlist)).toEqual('logo.jpg')
    })
  })
}
