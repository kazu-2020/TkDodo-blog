import { HiOutlineMinus } from 'react-icons/all'
import React from 'react'
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

import { SeriesPlaylist } from '@/types/series_playlist'
import { useSeriesDeckFormStore } from '@/features/series-decks/stores/seriesDeckForm'

const countWrapper = (count: number | undefined): number | string =>
  count === undefined ? '-' : count
export const EditSeriesPlaylistListItem = ({
  playlist
}: {
  playlist: SeriesPlaylist
}) => {
  const removeSeriesPlaylist = useSeriesDeckFormStore(
    (state) => state.removeSeriesPlaylist
  )

  return (
    <Grid
      templateColumns="repeat(10, 1fr)"
      gap={6}
      fontSize="sm"
      py={3}
      borderBottom="1px"
      borderColor="gray.200"
    >
      <GridItem h="8" textAlign="center">
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
            removeSeriesPlaylist(playlist.seriesId)
          }}
        >
          <Icon as={HiOutlineMinus} />
        </Button>
      </GridItem>
      <GridItem colSpan={5} h="8">
        <HStack>
          <Image
            src={
              playlist.logo?.medium?.url ??
              '/public/dummy/default1/default1-logo.png' // FIXME: series画像にフォールバック
            }
            alt={playlist.name}
            h="32px"
            boxShadow="md"
            mr={1}
          />
          <Text noOfLines={1}>{playlist.name}</Text>
        </HStack>
      </GridItem>
      <GridItem colSpan={4} h="8">
        <Flex alignItems="center" h="8">
          <Text>
            TEp:{countWrapper(playlist.itemNum)}/Hw:
            {countWrapper(playlist.howToCount)}/Ev:
            {countWrapper(playlist.eventCount)}/Fa:
            {countWrapper(playlist.faqPageCount)}
          </Text>
        </Flex>
      </GridItem>
    </Grid>
  )
}
