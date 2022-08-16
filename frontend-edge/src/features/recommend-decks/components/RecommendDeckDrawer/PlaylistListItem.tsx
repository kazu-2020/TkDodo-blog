import { Box, HStack, Image, Skeleton, Text, VStack } from '@chakra-ui/react'

import { dummyImageUrl } from '@/utils/image'
import { RecommendDeck } from '@/types/recommend_deck'
import { Playlist } from '@/types/playlist'
import { EpisodeData } from '@/types/episode_data'
import { usePlaylistItems } from '@/features/recommend-decks/api/getPlaylistItems'

type Props = {
  recommendDeck: RecommendDeck
  playlistItem: Playlist
}

export const PlaylistListItem = ({ recommendDeck, playlistItem }: Props) => {
  const { data, isLoading, isError, isSuccess } = usePlaylistItems({
    playlistUid: playlistItem.playlistUId,
    limit: 10
  })

  const logoUrl =
    playlistItem.logo.medium?.url ||
    dummyImageUrl(recommendDeck.dateCreated, 'logo')

  return (
    <HStack w="100%" align="flex-start">
      <Box>
        <Image src={logoUrl} w={10} h={10} />
      </Box>
      <VStack w="100%" align="flex-start" spacing={0}>
        <Text>{playlistItem.name}</Text>
        {isError && <Text>エラーが発生しました</Text>}
        {isLoading && <Skeleton data-testid="skeleton" h="48px" w="100%" />}
        {isSuccess && data.length <= 0 && <Text>エピソードはありません</Text>}
        {isSuccess && data.length > 0 && (
          <HStack wrap="wrap" spacing={0}>
            {data.map((episode: EpisodeData) => (
              <Box key={episode.id} px={1} py={1}>
                <Image w="50px" src={episode.eyecatch?.medium?.url} />
              </Box>
            ))}
          </HStack>
        )}
      </VStack>
    </HStack>
  )
}
