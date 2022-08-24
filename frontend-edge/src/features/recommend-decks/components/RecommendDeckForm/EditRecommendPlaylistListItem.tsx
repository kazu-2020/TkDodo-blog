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

import { RecommendPlaylist } from '@/types/recommend_playlist'
import { useRecommendDeckFormStore } from '@/features/recommend-decks/stores/recommendDeckForm'

const countWrapper = (count: number | undefined): number | string =>
  count === undefined ? '-' : count
export const EditRecommendPlaylistListItem = ({
  playlist
}: {
  playlist: RecommendPlaylist
}) => {
  const removeRecommendPlaylist = useRecommendDeckFormStore(
    (state) => state.removeRecommendPlaylist
  )

  return (
    <Grid
      templateColumns="repeat(12, 1fr)"
      gap={6}
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
            removeRecommendPlaylist(playlist.seriesId)
          }}
        >
          <Icon as={HiOutlineMinus} />
        </Button>
      </GridItem>
      <GridItem colSpan={6} h="8">
        <HStack>
          <Image
            src={
              playlist.logo?.medium?.url ??
              '/public/dummy/default1/default1-logo.png' // FIXME: recommend画像にフォールバック
            }
            alt={playlist.name}
            h="32px"
            boxShadow="md"
            mr={1}
          />
          <Text>{playlist.name}</Text>
        </HStack>
      </GridItem>
      <GridItem colSpan={5} h="8">
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
