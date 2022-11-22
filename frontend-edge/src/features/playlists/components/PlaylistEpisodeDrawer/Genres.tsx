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

if (import.meta.vitest) {
  const { episodeDataGenerator, genreGenerator } = await import(
    '@/test/data-generators'
  )

  const { describe, it, expect } = import.meta.vitest
  describe('broadcastGenres', () => {
    const genre1 = genreGenerator()
    const genre2 = genreGenerator()

    it('ジャンル名の変換', () => {
      const episode = episodeDataGenerator({
        broadcastEvent: [{ identifierGroup: { genres: [genre1, genre2] } }]
      })
      const genres = broadcastGenres(episode)
      expect(genres).toHaveLength(2)
      expect(genres[0].id).toEqual(genre1.id)
      expect(genres[0].name).toEqual(`${genre1.name1}/${genre1.name2}`)
      expect(genres[1].id).toEqual(genre2.id)
      expect(genres[1].name).toEqual(`${genre2.name1}/${genre2.name2}`)
    })

    it('先頭のブロードキャストのジャンルが有効なこと', () => {
      const episode = episodeDataGenerator({
        broadcastEvent: [
          { identifierGroup: { genres: [genre1] } },
          { identifierGroup: { genres: [genre2] } }
        ]
      })
      const genres = broadcastGenres(episode)
      expect(genres).toHaveLength(1)
      expect(genres[0].id).toEqual(genre1.id)
      expect(genres[0].name).toEqual(`${genre1.name1}/${genre1.name2}`)
    })

    it('ジャンルが空のとき', () => {
      const episode = episodeDataGenerator({
        broadcastEvent: [{ identifierGroup: { genres: [] } }]
      })
      const genres = broadcastGenres(episode)

      expect(genres).toHaveLength(0)
    })

    it('ジャンルが未定義のとき', () => {
      const episode = episodeDataGenerator({
        broadcastEvent: [{ identifierGroup: { genres: undefined } }]
      })
      const genres = broadcastGenres(episode)

      expect(genres).toHaveLength(0)
    })
  })
}
