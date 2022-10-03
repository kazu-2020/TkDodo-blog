import { Box, HStack, Image, Skeleton, Text, VStack } from '@chakra-ui/react'

import { dummyImageUrl } from '@/utils/image'
import { SeriesPlaylist } from '@/types/series_playlist'
import { SeriesDeck } from '@/types/series_deck'
import { EpisodeData } from '@/types/episode_data'
import { useSeriesPlaylistEpisodes } from '@/features/series-decks/api/getSeriesPlaylistEpisodes'

type Props = {
  seriesDeck: SeriesDeck
  playlistItem: SeriesPlaylist
}
export const PlaylistListItem = ({ seriesDeck, playlistItem }: Props) => {
  const { data, isLoading, isError, isSuccess } = useSeriesPlaylistEpisodes({
    playlistId: playlistItem.id
  })

  const logoUrl =
    playlistItem.logo.medium?.url ||
    dummyImageUrl(seriesDeck.dateCreated, 'logo')

  return (
    <HStack w="100%" align="flex-start">
      <Box>
        <Image src={logoUrl} w={10} h={10} />
      </Box>
      <VStack w="100%" align="flex-start" spacing={0}>
        <Text noOfLines={1}>{playlistItem.name}</Text>
        {isError && <Text>エラーが発生しました</Text>}
        {isLoading && <Skeleton data-testid="skeleton" h="48px" w="100%" />}
        {isSuccess && data.episodes.length <= 0 && (
          <Text>エピソードはありません</Text>
        )}
        {isSuccess && data.episodes.length > 0 && (
          <HStack wrap="wrap" spacing={0}>
            {data.episodes.map((episode: EpisodeData) => (
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
