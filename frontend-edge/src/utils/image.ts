import { EpisodeData } from '@/types/episode_data'

export const dummyImageUrl = (dateTime: string, imageType: string) => {
  const num = Number(new Date(dateTime).getUTCDate() % 10) + 1 || 1
  return `/dummy/default${num}/default${num}-${imageType}.png`
}

export const episodeThumbnailUrl = (
  episodeItem: EpisodeData,
  defaultImage?: string
) => {
  if (episodeItem?.eyecatch !== undefined) {
    return episodeItem.eyecatch?.medium?.url
  }
  if (episodeItem?.keyvisuals?.length) {
    return episodeItem?.keyvisuals[0]?.small?.url
  }
  if (episodeItem?.partOfSeries?.eyecatch !== undefined) {
    return episodeItem?.partOfSeries?.eyecatch?.medium?.url
  }

  return defaultImage === undefined ? '' : defaultImage
}
