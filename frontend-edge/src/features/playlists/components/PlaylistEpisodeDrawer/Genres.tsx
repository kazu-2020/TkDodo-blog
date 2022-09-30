import React from 'react'
import { Box, HStack, Text, VStack } from '@chakra-ui/react'

import { EpisodeData, Genre } from '@/types/episode_data'
import { GenreItems } from '@/features/playlists/components/PlaylistEpisodeDrawer/GenreItems'

type Props = {
  episode: EpisodeData
}

const broadcastGenres = (episode: EpisodeData) => {
  const broadcastEvent = episode.broadcastEvent?.at(0)
  if (broadcastEvent?.identifierGroup?.genres === undefined) return []

  return broadcastEvent.identifierGroup?.genres?.map((item: Genre) => ({
    id: item.id,
    name: `${item.name1}/${item.name2}`
  }))
}

export const Genres = ({ episode }: Props) => (
  <Box w="100%">
    <Text fontWeight="bold">シリーズジャンル</Text>

    <HStack backgroundColor="#EEEEEE" p={2} mt={1} mb={3}>
      <VStack alignItems="flex-start">
        <Text fontSize="8px" h="12px">
          フォーマット
        </Text>
        <GenreItems
          isRadius
          borderColor="#acdce2"
          backgroundColor="#acdce2"
          items={episode.partOfSeries?.identifierGroup?.formatGenre || []}
        />
      </VStack>
      <VStack>
        <Text fontSize="8px">&nbsp;</Text>
        <Text>/</Text>
      </VStack>
      <VStack alignItems="flex-start">
        <Text fontSize="8px" h="12px">
          テーマ
        </Text>
        <GenreItems
          isRadius
          borderColor="#acdce2"
          backgroundColor="white"
          items={episode?.partOfSeries?.identifierGroup?.themeGenre || []}
        />
      </VStack>
    </HStack>

    <Text fontWeight="bold">エピソードジャンル</Text>
    <HStack backgroundColor="#EEEEEE" p={2} mt={1} mb={3}>
      <VStack alignItems="flex-start">
        <Text fontSize="8px" h="12px">
          フォーマット
        </Text>
        <GenreItems
          isRadius
          borderColor="#fdacaf"
          backgroundColor="#fdacaf"
          items={episode.identifierGroup?.formatGenreTag || []}
        />
      </VStack>
      <VStack>
        <Text fontSize="8px">&nbsp;</Text>
        <Text>/</Text>
      </VStack>
      <VStack alignItems="flex-start">
        <Text fontSize="8px" h="12px">
          テーマ
        </Text>
        <GenreItems
          isRadius
          borderColor="#fdacaf"
          backgroundColor="white"
          items={episode.identifierGroup?.themeGenreTag || []}
        />
      </VStack>
    </HStack>

    <Text fontWeight="bold">ブロードキャストジャンル</Text>
    <Box backgroundColor="#EEEEEE" p={2} mt={1} mb={3}>
      <GenreItems
        isRadius={false}
        borderColor="#fedc9b"
        backgroundColor="#fedc9b"
        items={broadcastGenres(episode)}
      />
    </Box>
  </Box>
)
