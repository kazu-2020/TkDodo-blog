import React from 'react'
import { Box, Text } from '@chakra-ui/react'

import { RecommendPlaylist } from '@/types/recommend_playlist'
import { useRecommendDeckFormStore } from '@/features/recommend-decks/stores/recommendDeckForm'
import { SearchResultRow } from '@/features/recommend-decks/components/RecommendDeckForm/SearchResultRow'
import { SearchResultLoadMoreButton } from '@/features/recommend-decks/components/RecommendDeckForm/SearchResultLoadMoreButton'
import { SearchResultHeader } from '@/features/recommend-decks/components/RecommendDeckForm/SearchResultHeader'
import { SearchForm } from '@/features/recommend-decks/components/RecommendDeckForm/SearchForm'
import { useSearchRecommendPlaylists } from '@/features/recommend-decks/api/getRecommendPlaylists'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'

const PER_PAGE = 10

export const SearchRecommendPlaylist = () => {
  const {
    recommendPlaylists,
    addRecommendPlaylist,
    searchQuery,
    setSearchQuery,
    searchQueryKey,
    setSearchQueryKey,
    isSearched,
    setSearched
  } = useRecommendDeckFormStore((state) => ({
    recommendPlaylists: state.recommendPlaylists,
    addRecommendPlaylist: state.addRecommendPlaylist,
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
    searchQueryKey: state.searchQueryKey,
    setSearchQueryKey: state.setSearchQueryKey,
    isSearched: state.isSearched,
    setSearched: state.setSearched
  }))

  const onSearched = (q: string) => {
    setSearchQuery(q)
    setSearched(true)
  }

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSearchRecommendPlaylists({
      query: searchQuery,
      queryKey: searchQueryKey,
      size: PER_PAGE,
      isSearched
    })

  function hasRecommendPlaylist(playlist: RecommendPlaylist) {
    return recommendPlaylists.find((pl) => pl.seriesId === playlist.seriesId)
  }

  return (
    <Box>
      <SearchForm
        onAction={onSearched}
        onChange={(event) => {
          setSearchQueryKey(
            event.target.value as 'word' | 'keyword' | 'concern'
          )
        }}
      />

      {/* 検索結果 */}
      {isLoading && <ListScreenSkeleton size={PER_PAGE} />}
      {isSearched && !isLoading && !data && (
        <Text>検索結果がありませんでした。</Text>
      )}
      {isSearched && !isLoading && data && (
        <Box data-testid="recommend-playlist-search-results">
          <SearchResultHeader searchResultCount={data.pages[0].count} />

          {data?.pages.map(({ result }) =>
            result?.map((playlist) => {
              if (hasRecommendPlaylist(playlist)) {
                return null
              }

              return (
                <SearchResultRow
                  key={playlist.stringId}
                  onClick={() => {
                    addRecommendPlaylist(playlist)
                  }}
                  playlist={playlist}
                />
              )
            })
          )}

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
