import React from 'react'
import {
  Box,
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
  currentPlaylist?: Playlist
  episode: EpisodeData
}

const playlistFormatGenres = (name?: string): FormatType[] =>
  name ? [{ id: 0, name }] : []
const playlistThemeGenres = (name?: string): ThemeType[] =>
  name ? [{ id: 0, name }] : []

const NoPlaylist = () => (
  <Box px={0} py={0}>
    <Spacer mt={5} />
    <Text fontSize="sm" color="rgba(0, 0, 0, 0.6)">
      プレイリストは登録されていません
    </Text>
  </Box>
)

export const RelatedPlaylists = ({ currentPlaylist, episode }: Props) => {
  const { isLoading, data } = useEpisodePlaylist(episode.id)
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
          {data?.map((playlist: Playlist) => {
            const logoImage =
              playlist.logo.medium?.url || 'https://placehold.jp/140x140.png'
            return (
              <Box key={playlist.playlistUId} maxWidth="33%" mr={4}>
                <Link
                  href={`/playlists/${playlist.playlistUId}`}
                  _hover={{ textDecoration: 'none' }}
                  fontWeight="bold"
                >
                  {playlist.name}
                </Link>
                <Box pos="relative">
                  <Link href={`/playlists/${playlist.playlistUId}`}>
                    <Image
                      src={logoImage}
                      w="140px"
                      h="140px"
                      borderRadius="5px"
                      alt={playlist.name}
                    />
                  </Link>
                  {playlist.playlistUId === currentPlaylist?.playlistUId && (
                    <Text
                      pos="absolute"
                      top="8px"
                      right="12px"
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
            )
          })}
        </HStack>
      )}
    </VStack>
  )
}
