import { HiOutlineMinus } from 'react-icons/all'
import { UseFormSetValue } from 'react-hook-form/dist/types/form'
import { useFormContext, UseFormGetValues, useWatch } from 'react-hook-form'
import React from 'react'
import { differenceInMilliseconds } from 'date-fns'
import {
  Button,
  Center,
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
import { PlaylistFormInputs } from '@/features/playlists/types'
import { PlayableStatusBadge } from '@/components/PlayableStatusBadge'
import { episodeThumbnailUrl } from '@/utils/image'

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

const removeEpisode = (
  getValues: UseFormGetValues<PlaylistFormInputs>,
  setValue: UseFormSetValue<any>,
  episodeId: string
) => {
  const episodes = getValues('episodes').filter(
    (episode) => episode.id !== episodeId
  )
  setValue('episodes', episodes, { shouldDirty: true })
}

export const EditEpisodeListItem = ({ episode }: { episode: EpisodeData }) => {
  const { getValues, setValue } = useFormContext<PlaylistFormInputs>()

  return (
    <Grid
      templateColumns="repeat(36, 1fr)"
      gap={2}
      borderBottom="1px"
      borderColor="gray.200"
      fontSize="xs"
      p={2}
      w="100%"
    >
      <GridItem h="8" colSpan={3}>
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
            removeEpisode(getValues, setValue, episode.id)
          }}
        >
          <Icon as={HiOutlineMinus} />
        </Button>
      </GridItem>
      <GridItem colSpan={9} h="10" textAlign="left">
        <HStack p={0} m={0}>
          <Image
            w="74px"
            h="40px"
            borderRadius="4px"
            src={episodeThumbnailUrl(episode, 'https://placehold.jp/71x40.png')}
          />
          <Text>{episode.name}</Text>
        </HStack>
      </GridItem>
      <GridItem colSpan={5} h="10">
        <Center h="100%">
          <Text>{totalTime(episode)}</Text>
        </Center>
      </GridItem>
      <GridItem colSpan={8} h="10" textAlign="left">
        <Center h="100%">
          <Text w="100%" textAlign="left">
            {episode.partOfSeries?.name || ''}
          </Text>
        </Center>
      </GridItem>
      <GridItem colSpan={6} h="10" textAlign="center">
        <Center h="100%">
          <Text>{resentEventStartDate(episode)}</Text>
        </Center>
      </GridItem>
      <GridItem colSpan={5} h="10" textAlign="center">
        <Center h="100%">
          <PlayableStatusBadge isPlayable={hasVideo(episode?.videos || [])} />
        </Center>
      </GridItem>
    </Grid>
  )
}
