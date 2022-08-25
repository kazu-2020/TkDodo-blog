import { HiOutlinePlus } from 'react-icons/all'
import React from 'react'
import {
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

type Props = {
  playlist: RecommendPlaylist
  onClick: () => void
  hasRecommendPlaylist: boolean
}

export const RecommendPlaylistListItem = ({
  playlist,
  onClick,
  hasRecommendPlaylist
}: Props) => {
  const logoImage =
    playlist.logo?.medium?.url ?? '/public/dummy/default1/default1-logo.png'

  return (
    <Grid
      templateColumns="repeat(20, 1fr)"
      gap={6}
      borderBottom="1px"
      borderColor="gray.200"
      fontSize="xs"
      fontWeight="bold"
      p={2}
    >
      <GridItem colSpan={2} h={8} textAlign="center">
        {hasRecommendPlaylist && <Center h="100%">追加済み</Center>}
        {!hasRecommendPlaylist && (
          <Button
            aria-label="追加"
            boxShadow="md"
            h="8"
            w="8"
            minW="8"
            colorScheme="orange"
            bg="accent"
            color="black"
            borderRadius="sm"
            onClick={onClick}
          >
            <Icon as={HiOutlinePlus} />
          </Button>
        )}
      </GridItem>
      <GridItem colSpan={8} h={8}>
        <HStack>
          <Image src={logoImage} alt={playlist.name} h="30px" />
          <Text>{playlist.name}</Text>
        </HStack>
      </GridItem>
      <GridItem colSpan={5} h={8}>
        <Center h="100%">
          <Text fontSize="xl" fontWeight="normal">
            {playlist.article.markedBody ? '○' : '×'}
          </Text>
        </Center>
      </GridItem>
      <GridItem colSpan={5} h={8}>
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
    </Grid>
  )
}
