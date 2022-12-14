import React from 'react'
import {
  Box,
  Center,
  Grid,
  GridItem,
  HStack,
  Image,
  Text
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'

import { expansionLogoUrl } from '@/utils/image'
import { SeriesData } from '@/types/series_data'
import { PlayableStatusBadge } from '@/components/PlayableStatusBadge'

type Props = {
  onClick: () => void
  item: SeriesData
}

const isViewable = (series: SeriesData): boolean => {
  if (series.availableEpisodes?.count && series.availableEpisodes?.count > 0) {
    return true
  }
  return false
}

export const SearchSeriesItem = ({ item, onClick }: Props) => (
  <Grid
    templateColumns="repeat(13, 1fr)"
    gap={2}
    borderBottom="1px"
    borderColor="gray.200"
    fontSize="xs"
    p={2}
    w="100%"
    cursor="pointer"
    onClick={onClick}
  >
    <GridItem colSpan={10} h="10" textAlign="left">
      <HStack>
        <Box w="32px" h="32px" borderRadius="4px" flexBasis="32px">
          <Image
            w="32px"
            h="32px"
            borderRadius="4px"
            src={expansionLogoUrl(item)}
            alt={item.name}
          />
        </Box>
        <Text>{item.name}</Text>
      </HStack>
    </GridItem>
    <GridItem colSpan={1} h="10" textAlign="left">
      <Center h="100%">
        <PlayableStatusBadge isPlayable={isViewable(item)} />
      </Center>
    </GridItem>
    <GridItem colSpan={2} h="10" textAlign="right">
      <Center h="100%" justifyContent="flex-end">
        <ChevronRightIcon h="20px" w="20px" color="#009688" />
      </Center>
    </GridItem>
  </Grid>
)

if (import.meta.vitest) {
  const { seriesDataGenerator } = await import('@/test/data-generators')

  const { describe, it, expect } = import.meta.vitest
  describe('isViewable', () => {
    it('availableEpisodesが未定義の場合', () => {
      const seriesData = seriesDataGenerator({ availableEpisodes: undefined })
      expect(isViewable(seriesData)).toBeFalsy()
    })

    it('availableEpisodesが0件の場合', () => {
      const seriesData = seriesDataGenerator({
        availableEpisodes: { count: 0 }
      })
      expect(isViewable(seriesData)).toBeFalsy()
    })

    it('availableEpisodesが1件の場合', () => {
      const seriesData = seriesDataGenerator({
        availableEpisodes: { count: 1 }
      })
      expect(isViewable(seriesData)).toBeTruthy()
    })
  })
}
