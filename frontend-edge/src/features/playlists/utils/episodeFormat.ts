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
