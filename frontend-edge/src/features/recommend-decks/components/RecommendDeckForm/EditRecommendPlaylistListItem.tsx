import { HiOutlineMinus } from 'react-icons/all'
import React from 'react'
import { nanoid } from 'nanoid'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  HStack,
  Image,
  Skeleton,
  Text
} from '@chakra-ui/react'
import { Icon } from '@chakra-ui/icons'

import { episodeThumbnailUrl } from '@/utils/image'
import { RecommendPlaylist } from '@/types/recommend_playlist'
import { EpisodeData } from '@/types/episode_data'
import { useRecommendDeckFormStore } from '@/features/recommend-decks/stores/recommendDeckForm'
import { usePlaylistItems } from '@/features/recommend-decks/api/getPlaylistItems'

export const EditRecommendPlaylistListItem = ({
  playlist
}: {
  playlist: RecommendPlaylist
}) => {
  const removeRecommendPlaylist = useRecommendDeckFormStore(
    (state) => state.removeRecommendPlaylist
  )

  const { data, isLoading, refetch } = usePlaylistItems({
    playlistUid: playlist.playlistUId,
    limit: 10,
    enabled: false
  })

  const logoImage =
    playlist.logo?.medium?.url ?? '/public/dummy/default1/default1-logo.png'

  return (
    <Accordion allowToggle>
      <AccordionItem
        border="none"
        borderBottom="1px"
        borderBottomColor="rgba(0, 0, 0, 0.12)"
      >
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
                onClick={() => {
                  if (!data) {
                    refetch()
                  }
                }}
              >
                <Text fontSize="sm">エピソード表示</Text>
                <AccordionIcon />
              </AccordionButton>
            </Center>
          </GridItem>
        </Grid>
        <AccordionPanel border="none" py={0} px={2}>
          <Box
            ml="90px"
            borderTop="1px"
            borderTopColor="rgba(0, 0, 0, 0.12)"
            py={3}
          >
            {isLoading && (
              <Skeleton
                data-testid="skeleton"
                h={8}
                bg="white"
                borderRadius="md"
              />
            )}
            {!isLoading && (!data || data.length <= 0) && (
              <Text fontSize="sm">エピソードはありません</Text>
            )}
            {!isLoading && data && (
              <HStack px={0}>
                {data.map((episodeData: EpisodeData) => (
                  <Image
                    key={episodeData.id}
                    w="44px"
                    h="24px"
                    alt={episodeData.name}
                    title={episodeData.name}
                    src={episodeThumbnailUrl(
                      episodeData,
                      'https://placehold.jp/100x56.png'
                    )}
                  />
                ))}
              </HStack>
            )}
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
