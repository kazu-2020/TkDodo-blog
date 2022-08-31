import { HiOutlineMinus } from 'react-icons/all'
import React from 'react'
import { differenceInMilliseconds } from 'date-fns'
import {
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Text
} from '@chakra-ui/react'
import { Icon } from '@chakra-ui/icons'

import { hasVideo } from '@/utils/video'
import { formatDateWithWeekday } from '@/utils/format'
import { EpisodeData } from '@/types/episode_data'
import { usePlaylistFormStore } from '@/features/playlists/stores/playlistForm'
import { PlayableStatusBadge } from '@/components/PlayableStatusBadge'

const eyecatchUrl = (episode: EpisodeData) => {
  if (episode.eyecatch !== undefined) {
    return episode.eyecatch.medium?.url
  }
  if (episode.keyvisuals !== undefined) {
    return episode.keyvisuals[0]?.small?.url
  }
  if (episode.partOfSeries?.eyecatch !== undefined) {
    return episode.partOfSeries.eyecatch.medium?.url
  }

  return 'https://placehold.jp/71x40.png'
}

const seriesName = (episode: EpisodeData) => episode?.partOfSeries?.name || ''

const totalTime = (episode: EpisodeData) => {
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

const resentEventStartDate = (episode: EpisodeData) => {
  const startDate = episode.detailedRecentEvent?.startDate
  if (startDate === undefined) return ''

  return formatDateWithWeekday(startDate)
}

export const EditEpisodeListItem = ({ episode }: { episode: EpisodeData }) => {
  const removeEpisode = usePlaylistFormStore((state) => state.removeEpisode)

  return (
    <Grid
      templateColumns="repeat(12, 1fr)"
      gap={1}
      fontSize="sm"
      py={3}
      borderBottom="1px"
      borderColor="gray.200"
    >
      <GridItem h="8">
        <Button
          aria-label="削除"
          boxShadow="md"
          h="8"
          w="8"
          minW="8"
          colorScheme="orange"
          bg="accent"
          color="black"
          borderRadius="sm"
          onClick={() => {
            removeEpisode(episode.id)
          }}
        >
          <Icon as={HiOutlineMinus} />
        </Button>
      </GridItem>
      <GridItem colSpan={5} h="8">
        <HStack>
          <Image
            src={eyecatchUrl(episode)}
            alt={episode.name}
            h={8}
            boxShadow="md"
            mr={1}
          />
          <Text>{episode.name}</Text>
        </HStack>
      </GridItem>
      {/* 再生時間 */}
      <GridItem colSpan={1} h="8">
        <Flex alignItems="center" h="8">
          {totalTime(episode)}
        </Flex>
      </GridItem>
      {/* シリーズ名 */}
      <GridItem colSpan={2} h="8">
        <Flex alignItems="center" h="8">
          {seriesName(episode)}
        </Flex>
      </GridItem>
      {/* 直近放送日 */}
      <GridItem colSpan={2} h="8">
        <Flex alignItems="center" h="8">
          {resentEventStartDate(episode)}
        </Flex>
      </GridItem>
      {/* 視聴状況 */}
      <GridItem colSpan={1} h="8">
        <Flex alignItems="center" h="8">
          <PlayableStatusBadge isPlayable={hasVideo(episode?.videos || [])} />
        </Flex>
      </GridItem>
    </Grid>
  )
}
