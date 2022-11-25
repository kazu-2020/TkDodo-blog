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

import { SeriesData } from '@/types/series_data'
import { PlayableStatusBadge } from '@/components/PlayableStatusBadge'

type Props = {
  onClick: () => void
  item: SeriesData
}

const logoUrl = (series: SeriesData) => {
  if (series.logo?.medium?.url !== undefined) {
    return series.logo?.medium?.url
  }
  if (
    series.keyvisuals !== undefined &&
    series.keyvisuals[0]?.small?.url !== undefined
  ) {
    return series.keyvisuals[0]?.small?.url
  }
  if (series.partOfSeries?.logo?.medium?.url !== undefined) {
    return series.partOfSeries?.logo?.medium?.url
  }

  return 'https://placehold.jp/40x40.png'
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
            src={logoUrl(item)}
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
  describe('logoUrl', () => {
    it('logoが設定されている場合', () => {
      const seriesData = seriesDataGenerator({
        logo: { medium: { url: 'logo.jpg', width: 1, height: 1 } }
      })
      expect(logoUrl(seriesData)).toEqual('logo.jpg')
    })

    it('keyvisualsが設定されている場合', () => {
      const seriesData = seriesDataGenerator({
        keyvisuals: [
          { small: { url: 'keylogo1.jpg', width: 1, height: 1 } },
          { small: { url: 'keylogo2.jpg', width: 1, height: 1 } }
        ]
      })
      expect(logoUrl(seriesData)).toEqual('keylogo1.jpg')
    })

    it('partOfSeries.logoが設定されている場合', () => {
      const seriesData = seriesDataGenerator({
        partOfSeries: {
          name: 'test',
          logo: { medium: { url: 'partlogo.jpg', width: 1, height: 1 } }
        }
      })
      expect(logoUrl(seriesData)).toEqual('partlogo.jpg')
    })

    it('すべて設定されていない場合', () => {
      const seriesData = seriesDataGenerator()
      expect(logoUrl(seriesData)).toEqual('https://placehold.jp/40x40.png')
    })

    it('すべて設定されている場合', () => {
      const seriesData = seriesDataGenerator({
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
      expect(logoUrl(seriesData)).toEqual('logo.jpg')
    })
  })

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
