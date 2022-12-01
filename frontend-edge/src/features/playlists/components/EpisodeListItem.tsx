import React from 'react'
import { Box, Flex, HStack, Image, StyleProps, Text } from '@chakra-ui/react'

import { hasVideo } from '@/utils/video'
import { episodeThumbnailUrl } from '@/utils/image'
import { formatDatetimeWithWeekday } from '@/utils/format'
import { EpisodeData } from '@/types/episode_data'

type Props = {
  episodeItem: EpisodeData
  isSmall?: boolean
}

const startDate = (episodeItem: EpisodeData) => {
  const date = episodeItem.detailedRecentEvent?.startDate || ''
  if (date.length === 0) {
    return '-'
  }

  return formatDatetimeWithWeekday(date)
}

export const EpisodeListItem = ({
  episodeItem,
  isSmall = false,
  ...props
}: Props & StyleProps) => {
  const serviceLogoUrl =
    episodeItem.releasedEvent?.publishedOn?.images?.badgeSmall?.url || ''
  const seriesName = episodeItem.partOfSeries?.name || ''

  return (
    <Flex {...props} data-testid="playlist-drawer-episode-list__item">
      <Box
        pos="relative"
        flexGrow={0}
        flexShrink={0}
        flexBasis={isSmall ? 0 : '100px'}
      >
        <Image
          w="100px"
          h="56px"
          src={episodeThumbnailUrl(episodeItem)}
          fallbackSrc="https://placehold.jp/100x56.png"
        />
        {episodeItem.videos && !hasVideo(episodeItem.videos) && (
          <Text
            pos="absolute"
            top={0}
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
      {isSmall && (
        <Text w="100%" fontSize="sm" noOfLines={3}>
          {episodeItem.name}
        </Text>
      )}
      {!isSmall && (
        <Flex flexDirection="column" ml={2} flex="1 1 auto" minWidth={0}>
          <Text
            textOverflow="ellipsis"
            noOfLines={1}
            fontSize="sm"
            lineHeight="18px"
          >
            {episodeItem.name}
          </Text>
          <HStack pt={0.5}>
            <Image h="12px" src={serviceLogoUrl} />
            <Text fontSize="xs" color="rgba(0, 0, 0, 0.6)">
              {seriesName}
            </Text>
          </HStack>
          <Text fontSize="xs" color="rgba(0, 0, 0, 0.6)">
            直近放送日: {startDate(episodeItem)}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}

if (import.meta.vitest) {
  const { episodeDataGenerator } = await import('@/test/data-generators')

  const { describe, it, expect } = import.meta.vitest
  describe('startDate', () => {
    // episodeItem.detailedRecentEvent?.startDate
    it('日付が未定義の場合', () => {
      const episode = episodeDataGenerator({
        detailedRecentEvent: { startDate: undefined }
      })
      expect(startDate(episode)).toEqual('-')
    })

    it('日付が空の場合', () => {
      const episode = episodeDataGenerator({
        detailedRecentEvent: { startDate: '' }
      })
      expect(startDate(episode)).toEqual('-')
    })

    it('日付が定義されている場合', () => {
      const episode = episodeDataGenerator({
        detailedRecentEvent: { startDate: '2022-01-02 23:12:11' }
      })
      expect(startDate(episode)).toEqual('2022年01月02日(日) 23:12')
    })
  })
}
