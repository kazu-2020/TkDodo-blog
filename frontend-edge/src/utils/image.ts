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

if (import.meta.vitest) {
  const { episodeDataGenerator } = await import('@/test/data-generators')

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
}
