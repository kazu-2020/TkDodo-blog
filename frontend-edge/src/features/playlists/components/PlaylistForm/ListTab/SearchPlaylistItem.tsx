import React from 'react'
import { Box, Grid, GridItem, HStack, Image, Text } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'

import { expansionLogoUrl } from '@/utils/image'
import { Playlist } from '@/types/playlist'
import { PlayableStatusBadge } from '@/components/PlayableStatusBadge'

type Props = {
  item: Playlist
  onClick: () => void
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
            src={expansionLogoUrl(item)}
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
