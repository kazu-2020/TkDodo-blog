import React, { useState } from 'react'
import { Box, Text } from '@chakra-ui/react'

import { RecommendPlaylist } from '@/types/recommend_playlist'
import { SearchResultLoadMoreButton } from '@/features/series-decks/components/SeriesDeckForm'
import { useRecommendDeckFormStore } from '@/features/recommend-decks/stores/recommendDeckForm'
import { RecommendPlaylistListItem } from '@/features/recommend-decks/components/RecommendDeckForm/RecommendPlaylistListItem'
import { RecommendPlaylistListHeader } from '@/features/recommend-decks/components/RecommendDeckForm/RecommendPlaylistListHeader'
import { usePlaylists } from '@/features/recommend-decks/api/getPlaylists'
import { SearchTextInput } from '@/components/SearchTextInput'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'

const PER_PAGE = 10

export const RecommendPlaylistList = () => {
  const { recommendPlaylists, addRecommendPlaylist } =
    useRecommendDeckFormStore((state) => ({
      recommendPlaylists: state.recommendPlaylists,
      addRecommendPlaylist: state.addRecommendPlaylist
    }))
  const [query, setQuery] = useState('')

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    usePlaylists({
      query,
      per: PER_PAGE,
      withEpisodeCount: 1
    })

  function hasRecommendPlaylist(playlist: RecommendPlaylist) {
    return recommendPlaylists.some(
      (pl) => pl.playlistUId === playlist.playlistUId
    )
  }

  const onAction = (q: string) => {
    setQuery(q)
  }

  return (
    <Box>
      <SearchTextInput
        placeholder="プレイリストを検索する"
        onAction={onAction}
      />
      {/* 検索結果 */}
      {isLoading && <ListScreenSkeleton size={PER_PAGE} />}
      {!isLoading && !data && <Text>編成可能なプレイリストがありません</Text>}
      {!isLoading && data && (
        <Box py={3}>
          <Text>全{data?.pages?.at(0)?.pagination.count}件</Text>
          <RecommendPlaylistListHeader />
          <Box data-testid="recommend-playlist-search-results">
            {data?.pages.map(({ playlists }) =>
              playlists?.map((playlist: RecommendPlaylist) => (
                <RecommendPlaylistListItem
                  key={playlist.playlistUId}
                  hasRecommendPlaylist={hasRecommendPlaylist(playlist)}
                  playlist={playlist}
                  onClick={() => addRecommendPlaylist(playlist)}
                />
              ))
            )}
          </Box>
          {hasNextPage && (
            <SearchResultLoadMoreButton
              perPage={PER_PAGE}
              onClick={() => fetchNextPage()}
              isLoading={isFetchingNextPage}
            />
          )}
        </Box>
      )}
    </Box>
  )
}
