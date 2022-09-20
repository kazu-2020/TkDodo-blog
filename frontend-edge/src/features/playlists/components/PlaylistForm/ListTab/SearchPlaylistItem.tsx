import React from 'react'
import { Box, Grid, GridItem, HStack, Image, Text } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'

import { Playlist } from '@/types/playlist'
import { PlayableStatusBadge } from '@/components/PlayableStatusBadge'

type Props = {
  item: Playlist
  onClick: () => void
}

const logoUrl = (playlist: Playlist) => {
  if (playlist.logo !== undefined) {
    return playlist.logo?.medium?.url
  }
  if (playlist.keyvisuals !== undefined) {
    return playlist.keyvisuals[0]?.small?.url
  }
  if (playlist.partOfSeries?.logo !== undefined) {
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
      <ChevronRightIcon />
    </GridItem>
  </Grid>
)
