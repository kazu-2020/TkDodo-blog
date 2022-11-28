import React from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  Image,
  Skeleton,
  Text
} from '@chakra-ui/react'

import { episodeThumbnailUrl } from '@/utils/image'
import { RecommendPlaylist } from '@/types/recommend_playlist'
import { EpisodeData } from '@/types/episode_data'
import { EditRecommendPlaylistListItemDetail } from '@/features/recommend-decks/components/RecommendDeckForm/EditRecommendPlaylistListItemDetail'
import { usePlaylistItems } from '@/features/recommend-decks/api/getPlaylistItems'

export const EditRecommendPlaylistListItem = ({
  playlist
}: {
  playlist: RecommendPlaylist
}) => {
  const { data, isLoading, refetch } = usePlaylistItems({
    playlistUid: playlist.playlistUid,
    limit: 10,
    enabled: false
  })

  return (
    <Accordion allowToggle data-testid="edit-recommend-playlist__item">
      <AccordionItem
        border="none"
        borderBottom="1px"
        borderBottomColor="rgba(0, 0, 0, 0.12)"
      >
        <EditRecommendPlaylistListItemDetail
          playlist={playlist}
          onToggleAccordion={() => {
            if (!data) {
              refetch()
            }
          }}
        />
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
