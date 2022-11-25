import React from 'react'
import { Box, Grid, GridItem, HStack, Image, Text } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'

import { Playlist } from '@/types/playlist'
import { PlayableStatusBadge } from '@/components/PlayableStatusBadge'
import { PartOfSeries } from '@/types/episode_data'

type Props = {
  item: Playlist
  onClick: () => void
}

const logoUrl = (playlist: Playlist) => {
  if (playlist.logo?.medium?.url !== undefined) {
    return playlist.logo?.medium?.url
  }
  if (
    playlist.keyvisuals !== undefined &&
    playlist.keyvisuals[0]?.small?.url !== undefined
  ) {
    return playlist.keyvisuals[0]?.small?.url
  }
  if (playlist.partOfSeries?.logo?.medium?.url !== undefined) {
    return playlist.partOfSeries?.logo?.medium?.url
  }

  return 'https://placehold.jp/40x40.png'
}

const isViewable = (series: Playlist): boolean => {
  if (series.availableEpisodes?.count && series.availableEpisodes?.count > 0) {
    return true
  }
  return false
}

export const SearchPlaylistItem = ({ item, onClick }: Props) => (
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
      <PlayableStatusBadge isPlayable={isViewable(item)} />
    </GridItem>
    <GridItem colSpan={1} h="10" textAlign="right">
      <ChevronRightIcon h="20px" w="20px" color="#009688" />
    </GridItem>
  </Grid>
)

if (import.meta.vitest) {
  const { playlistGenerator } = await import('@/test/data-generators')

  const { describe, it, expect } = import.meta.vitest
  describe('logoUrl', () => {
    it('logoが設定されている場合', () => {
      const playlist = playlistGenerator({
        logo: { medium: { url: 'logo.jpg', width: 1, height: 1 } }
      })
      expect(logoUrl(playlist)).toEqual('logo.jpg')
    })

    it('keyvisualsが設定されている場合', () => {
      const playlist = playlistGenerator({
        keyvisuals: [
          { small: { url: 'keylogo1.jpg', width: 1, height: 1 } },
          { small: { url: 'keylogo2.jpg', width: 1, height: 1 } }
        ]
      })
      expect(logoUrl(playlist)).toEqual('keylogo1.jpg')
    })

    it('partOfSeries.logoが設定されている場合', () => {
      const playlist = playlistGenerator({
        partOfSeries: {
          name: 'test',
          logo: { medium: { url: 'partlogo.jpg', width: 1, height: 1 } }
        }
      })
      expect(logoUrl(playlist)).toEqual('partlogo.jpg')
    })

    it('すべて設定されていない場合', () => {
      const playlist = playlistGenerator()
      expect(logoUrl(playlist)).toEqual('https://placehold.jp/40x40.png')
    })

    it('すべて設定されている場合', () => {
      const playlist = playlistGenerator({
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
      expect(logoUrl(playlist)).toEqual('logo.jpg')
    })
  })

  describe('isViewable', () => {
    it('availableEpisodesが未定義の場合', () => {
      const playlist = playlistGenerator({ availableEpisodes: undefined })
      expect(isViewable(playlist)).toBeFalsy()
    })

    it('availableEpisodesが0件の場合', () => {
      const playlist = playlistGenerator({ availableEpisodes: { count: 0 } })
      expect(isViewable(playlist)).toBeFalsy()
    })

    it('availableEpisodesが1件の場合', () => {
      const playlist = playlistGenerator({ availableEpisodes: { count: 1 } })
      expect(isViewable(playlist)).toBeTruthy()
    })
  })
}
