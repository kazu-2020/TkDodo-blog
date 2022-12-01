import { differenceInMilliseconds } from 'date-fns'

import { formatDateWithWeekday } from '@/utils/format'
import { EpisodeData } from '@/types/episode_data'

export const totalTime = (episode: EpisodeData) => {
  if (episode.detailedRecentEvent === undefined) return '--:--:--'
  const totalSecond =
    differenceInMilliseconds(
      new Date(episode.detailedRecentEvent.endDate),
      new Date(episode.detailedRecentEvent.startDate)
    ) / 1000

  const seconds = totalSecond % 60
  const totalMinutes = (totalSecond - seconds) / 60
  const minutes = totalMinutes % 60
  const hours = Math.floor(totalMinutes / 60)

  return `${`00${hours}`.slice(-2)}:${`00${minutes}`.slice(
    -2
  )}:${`00${seconds}`.slice(-2)}`
}

export const resentEventStartDate = (episode: EpisodeData) => {
  const startDate = episode.detailedRecentEvent?.startDate
  if (startDate === undefined) return ''

  return formatDateWithWeekday(startDate)
}

if (import.meta.vitest) {
  const { episodeDataGenerator } = await import('@/test/data-generators')

  const { describe, it, expect } = import.meta.vitest
  describe('totalTime', () => {
    it('日時の差がある場合', () => {
      const episode = episodeDataGenerator({
        detailedRecentEvent: {
          startDate: '2022-01-01 00:00:00',
          endDate: '2022-01-01 12:34:56',
          publishedOn: {}
        }
      })
      expect(totalTime(episode)).toEqual('12:34:56')
    })

    it('detailedRecentEventが未定義の場合', () => {
      const episode = episodeDataGenerator({ detailedRecentEvent: undefined })
      expect(totalTime(episode)).toEqual('--:--:--')
    })
  })

  describe('resentEventStartDate', () => {
    it('定義されているの場合', () => {
      const episdoe = episodeDataGenerator({
        detailedRecentEvent: {
          startDate: '2022-01-02 12:34:56',
          endDate: '2022-01-03 00:00:00',
          publishedOn: {}
        }
      })
      expect(resentEventStartDate(episdoe)).toEqual('2022年01月02日(日)')
    })

    it('未定義の場合', () => {
      const episode = episodeDataGenerator({ detailedRecentEvent: undefined })
      expect(resentEventStartDate(episode)).toEqual('')
    })
  })
}
