import { useParams } from 'react-router-dom'
import React from 'react'
import {
  Box,
  Center,
  HStack,
  Image,
  Link,
  Spacer,
  Text,
  VStack
} from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import { EpisodeData, FormatType, ThemeType } from '@/types/episode_data'
import { GenreItems } from '@/features/playlists/components/PlaylistEpisodeDrawer/GenreItems'
import { useEpisodePlaylist } from '@/features/playlists/api/getEpisodePlaylists'

type Props = {
  episode: EpisodeData
}

const playlistFormatGenres = (name?: string): FormatType[] =>
  name ? [{ id: 0, name }] : []
const playlistThemeGenres = (name?: string): ThemeType[] =>
  name ? [{ id: 0, name }] : []
const playlistLogoImage = (playlist: Playlist): string =>
  playlist.logo.medium?.url || 'https://placehold.jp/140x140.png'

const NoPlaylist = () => (
  <Box px={0} py={0}>
    <Spacer mt={5} />
    <Text fontSize="sm" color="rgba(0, 0, 0, 0.6)">
      プレイリストは登録されていません
    </Text>
  </Box>
)

export const RelatedPlaylists = ({ episode }: Props) => {
  const { isLoading, data } = useEpisodePlaylist(episode.id)
  const { playlistUId } = useParams()
  return (
    <VStack alignItems="flex-start" pt={4}>
      <Text
        borderLeft="4px"
        borderLeftColor="orange"
        pl="10px"
        fontWeight="bold"
        fontSize="sm"
        mb={2}
      >
        {episode.name}が含まれるプレイリスト
      </Text>
      {!isLoading && (data?.length || 0) <= 0 && NoPlaylist()}
      {!isLoading && (
        <HStack flexWrap="wrap" alignItems="flex-start" spacing={0} w="100%">
          {data?.map((playlist: Playlist) => (
            <Box key={playlist.playlistUId} maxWidth="33%" mr={4}>
              <Link
                w="140px"
                href={`/playlists/${playlist.playlistUId}`}
                _hover={{ textDecoration: 'none' }}
                fontWeight="bold"
                noOfLines={1}
              >
                {playlist.name}
              </Link>
              <Box pos="relative">
                <Center>
                  <Link href={`/playlists/${playlist.playlistUId}`}>
                    <Image
                      src={playlistLogoImage(playlist)}
                      w="140px"
                      h="140px"
                      borderRadius="5px"
                      alt={playlist.name}
                    />
                  </Link>
                </Center>
                {playlist.playlistUId === playlistUId && (
                  <Text
                    pos="absolute"
                    top="8px"
                    right="8px"
                    px="4px"
                    borderRadius="5px"
                    color="white"
                    fontSize="12px"
                    backgroundColor="orange"
                  >
                    現在編集中
                  </Text>
                )}
              </Box>
              <HStack p={2} mt={1} mb={3}>
                <VStack alignItems="flex-start">
                  <Text fontSize="8px" h="12px">
                    フォーマット
                  </Text>
                  <GenreItems
                    isRadius
                    borderColor="#99c24d"
                    backgroundColor="#99c24d"
                    items={playlistFormatGenres(playlist?.formatGenreName)}
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
                    borderColor="#99c24d"
                    backgroundColor="white"
                    items={playlistThemeGenres(playlist?.themeGenreName)}
                  />
                </VStack>
              </HStack>
            </Box>
          ))}
        </HStack>
      )}
    </VStack>
  )
}

if (import.meta.vitest) {
  const { playlistGenerator } = await import('@/test/data-generators')

  const { describe, it, expect } = import.meta.vitest
  describe('playlistFormatGenres', () => {
    it('名前が定義されている場合', () => {
      const genres = playlistFormatGenres('test')
      expect(genres).toHaveLength(1)
      expect(genres[0].id).toEqual(0)
      expect(genres[0].name).toEqual('test')
    })

    it('名前が定義されていない場合', () => {
      const genres = playlistFormatGenres(undefined)
      expect(genres).toHaveLength(0)
    })
  })
  describe('playlistThemeGenres', () => {
    it('名前が定義されている場合', () => {
      const genres = playlistThemeGenres('test')
      expect(genres).toHaveLength(1)
      expect(genres[0].id).toEqual(0)
      expect(genres[0].name).toEqual('test')
    })

    it('名前が定義されていない場合', () => {
      const genres = playlistThemeGenres(undefined)
      expect(genres).toHaveLength(0)
    })
  })
  describe('playlistLogoImage', () => {
    it('ロゴ画像が定義されている場合', () => {
      const playlist = playlistGenerator({
        logo: { medium: { url: 'test', witdh: 1, height: 1 } }
      })
      expect(playlistLogoImage(playlist)).toEqual('test')
    })
    it('ロゴ画像が定義されていない場合', () => {
      const playlist = playlistGenerator({
        logo: { medium: { url: undefined, witdh: 1, height: 1 } }
      })
      expect(playlistLogoImage(playlist)).toEqual(
        'https://placehold.jp/140x140.png'
      )
    })
  })
}
