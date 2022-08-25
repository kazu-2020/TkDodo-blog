import React from 'react'
import { Box, HStack, Text } from '@chakra-ui/react'

import { RecommendPlaylist } from '@/types/recommend_playlist'
import { useRecommendDeckFormStore } from '@/features/recommend-decks/stores/recommendDeckForm'
import { RecommendPlaylistListItem } from '@/features/recommend-decks/components/RecommendDeckForm/RecommendPlaylistListItem'
import { RecommendPlaylistListHeader } from '@/features/recommend-decks/components/RecommendDeckForm/RecommendPlaylistListHeader'
import { usePlaylists } from '@/features/recommend-decks/api/getPlaylists'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'

export const RecommendPlaylistList = () => {
  const { recommendPlaylists, addRecommendPlaylist } =
    useRecommendDeckFormStore((state) => ({
      recommendPlaylists: state.recommendPlaylists,
      addRecommendPlaylist: state.addRecommendPlaylist
    }))

  const { data, isLoading } = usePlaylists({
    per: 1000,
    withEpisodeCount: 1
  })

  function hasRecommendPlaylist(playlist: RecommendPlaylist) {
    return recommendPlaylists.some(
      (pl) => pl.playlistUId === playlist.playlistUId
    )
  }

  return (
    <Box>
      <HStack justifyContent="space-between">
        <Text>編成可能なプレイリスト</Text>
        {!isLoading && data && <Text>全{data.pagination.count}件</Text>}
      </HStack>
      {/* 検索結果 */}
      {isLoading && <ListScreenSkeleton size={10} />}
      {!isLoading && !data && <Text>編成可能なプレイリストがありません</Text>}
      {!isLoading && data && (
        <Box py={3}>
          <RecommendPlaylistListHeader />
          <Box data-testid="recommend-playlist-search-results">
            {data?.playlists?.map((playlist: RecommendPlaylist) => (
              <RecommendPlaylistListItem
                key={playlist.playlistUId}
                hasRecommendPlaylist={hasRecommendPlaylist(playlist)}
                playlist={playlist}
                onClick={() => addRecommendPlaylist(playlist)}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}
