import React from 'react'
import { Box, HStack, Image, Text, VStack } from '@chakra-ui/react'

import { formatDatetimeWithWeekday } from '@/utils/format'
import { EpisodeData } from '@/types/episode_data'
import { episodeThumbnailUrl } from '@/utils/image'

type Props = {
  episodeItem: EpisodeData
}

const hasVideo = (episodeItem: EpisodeData) => {
  const okushibuVideo = episodeItem.videos?.find(
    (video: any) =>
      video.detailedContentStatus?.environmentId === 'okushibu3' &&
      video.detailedContentStatus?.contentStatus === 'ready'
  )
  return !!okushibuVideo
}

const startDate = (episodeItem: EpisodeData) => {
  const date = episodeItem.detailedRecentEvent?.startDate || ''
  if (date.length === 0) {
    return '-'
  }

  return formatDatetimeWithWeekday(date)
}

export const EpisodeListItem = ({ episodeItem }: Props) => {
  const serviceLogoUrl =
    episodeItem.releasedEvent?.publishedOn?.images?.badgeSmall?.url || ''
  const seriesName = episodeItem.partOfSeries?.name || ''

  return (
    <HStack>
      <Box pos="relative" w="100px" h="56px">
        <Image
          pos="absolute"
          src={episodeThumbnailUrl(episodeItem)}
          fallbackSrc="https://placehold.jp/71x40.png"
        />
        {!hasVideo(episodeItem) && (
          <Text
            pos="absolute"
            w="100px"
            h="56px"
            fontSize="xs"
            color="white"
            align="center"
            lineHeight="56px"
            bgColor="rgba(0, 0, 0, 0.3)"
          >
            視聴不可
          </Text>
        )}
      </Box>
      <VStack spacing={0} align="flex-start">
        <Text fontSize="sm">{episodeItem.name}</Text>
        <HStack pt={1}>
          <Image h="12px" src={serviceLogoUrl} />
          <Text fontSize="xs" color="rgba(0, 0, 0, 0.6)">
            {seriesName}
          </Text>
        </HStack>
        <Text pt={0.5} fontSize="xs" color="rgba(0, 0, 0, 0.6)">
          直近放送日: {startDate(episodeItem)}
        </Text>
      </VStack>
    </HStack>
  )
}
