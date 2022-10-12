import React, { useEffect, useState } from 'react'
import { Alert, AlertIcon, AlertTitle, Box, Text } from '@chakra-ui/react'

import { RecommendPlaylist } from '@/types/recommend_playlist'
import { SearchResultLoadMoreButton } from '@/features/series-decks/components/SeriesDeckForm'
import { useRecommendDeckFormStore } from '@/features/recommend-decks/stores/recommendDeckForm'
import { RecommendPlaylistListItem } from '@/features/recommend-decks/components/RecommendDeckForm/RecommendPlaylistListItem'
import { RecommendPlaylistListHeader } from '@/features/recommend-decks/components/RecommendDeckForm/RecommendPlaylistListHeader'
import { usePlaylists } from '@/features/recommend-decks/api/getPlaylists'
import { SearchTextInput } from '@/components/SearchTextInput'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'
import { StartSearch } from '@/components/Alert'

const PER_PAGE = 10

type SearchQueryParams = {
  query?: string
  per: number
  withEpisodeCount: number
}

const createQueryParams = (filter: any): SearchQueryParams => ({
  query: filter.query,
  per: PER_PAGE,
  withEpisodeCount: 1
})

export const RecommendPlaylistList = () => {
  const { recommendPlaylists, addRecommendPlaylist } =
    useRecommendDeckFormStore((state) => ({
      recommendPlaylists: state.recommendPlaylists,
      addRecommendPlaylist: state.addRecommendPlaylist
    }))

  const [filter, setFilter] = useState({
    query: '',
    isSearch: false
  })

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch
  } = usePlaylists(createQueryParams(filter))

  useEffect(() => {
    refetch()
  }, [filter])

  function hasRecommendPlaylist(playlist: RecommendPlaylist) {
    return recommendPlaylists.some(
      (pl) => pl.playlistUId === playlist.playlistUId
    )
  }

  const onAction = (q: string) => {
    setFilter({ query: q, isSearch: true })
  }

  return (
    <Box>
      <SearchTextInput
        placeholder="プレイリストを検索する"
        onAction={onAction}
      />

      {!filter.isSearch && (
        <Box w="100%" py={10}>
          <StartSearch />
        </Box>
      )}

      {/* 検索結果 */}
      {filter.isSearch && isLoading && <ListScreenSkeleton size={PER_PAGE} />}
      {filter.isSearch && !isLoading && !data && (
        <Box w="100%" py={10}>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>編成可能なプレイリストがありません</AlertTitle>
          </Alert>
        </Box>
      )}
      {filter.isSearch && !isLoading && data && (
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
