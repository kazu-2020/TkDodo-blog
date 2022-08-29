import { HiOutlineMinus } from 'react-icons/all'
import React from 'react'
import {
  AccordionButton,
  AccordionIcon,
  Button,
  Center,
  Grid,
  GridItem,
  HStack,
  Image,
  Text
} from '@chakra-ui/react'
import { Icon } from '@chakra-ui/icons'

import { RecommendPlaylist } from '@/types/recommend_playlist'
import { useRecommendDeckFormStore } from '@/features/recommend-decks/stores/recommendDeckForm'

export const EditRecommendPlaylistListItemDetail = ({
  playlist,
  onToggleAccordion
}: {
  playlist: RecommendPlaylist
  onToggleAccordion: () => void
}) => {
  const removeRecommendPlaylist = useRecommendDeckFormStore(
    (state) => state.removeRecommendPlaylist
  )

  const logoImage =
    playlist.logo?.medium?.url ?? '/public/dummy/default1/default1-logo.png'

  return (
    <Grid
      templateColumns="repeat(20, 1fr)"
      gap={6}
      fontSize="xs"
      fontWeight="bold"
      p={2}
    >
      <GridItem colSpan={2} h={8} textAlign="center">
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
            removeRecommendPlaylist(playlist.playlistUId)
          }}
        >
          <Icon as={HiOutlineMinus} />
        </Button>
      </GridItem>
      <GridItem colSpan={6} h={8}>
        <HStack>
          <Image src={logoImage} alt={playlist.name} h="30px" />
          <Text>{playlist.name}</Text>
        </HStack>
      </GridItem>
      <GridItem colSpan={4} h={8}>
        <Center>
          <Text fontSize="xl" fontWeight="normal">
            {playlist.article.markedBody ? '○' : '×'}
          </Text>
        </Center>
      </GridItem>
      <GridItem colSpan={4} h={8}>
        <Center h="100%">
          <Center
            fontSize="sm"
            bg={playlist.playableItemsCount !== 0 ? 'pink' : 'gray'}
            rounded="md"
            color="white"
            h={8}
            px={4}
          >
            {playlist.playableItemsCount}/{playlist.itemNum}
          </Center>
        </Center>
      </GridItem>
      <GridItem colSpan={4} h={8}>
        <Center h={8}>
          <AccordionButton
            color="link"
            _hover={{}}
            onClick={() => onToggleAccordion()}
          >
            <Text fontSize="sm">エピソード表示</Text>
            <AccordionIcon />
          </AccordionButton>
        </Center>
      </GridItem>
    </Grid>
  )
}
