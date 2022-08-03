import React from 'react'
import { nanoid } from 'nanoid'
import { Box, Text } from '@chakra-ui/react'

import { SeriesPlaylist } from '@/types/series_playlist'
import { useSeriesDeckFormStore } from '@/features/series-decks/stores/seriesDeckForm'
import { SearchResultRow } from '@/features/series-decks/components/SeriesDeckForm/SearchResultRow'
import { SearchResultLoadMoreButton } from '@/features/series-decks/components/SeriesDeckForm/SearchResultLoadMoreButton'
import { SearchResultHeader } from '@/features/series-decks/components/SeriesDeckForm/SearchResultHeader'
import { SearchForm } from '@/features/series-decks/components/SeriesDeckForm/SearchForm'
import { useSearchSeriesPlaylists } from '@/features/series-decks/api/getSeriesPlaylists'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'

const PER_PAGE = 10

export const SearchSeriesPlaylist = () => {
  const {
    seriesPlaylists,
    addSeriesPlaylist,
    searchQuery,
    setSearchQuery,
    searchQueryKey,
    setSearchQueryKey,
    isSearched,
    setSearched
  } = useSeriesDeckFormStore((state) => ({
    seriesPlaylists: state.seriesPlaylists,
    addSeriesPlaylist: state.addSeriesPlaylist,
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
    useSearchSeriesPlaylists({
      query: searchQuery,
      queryKey: searchQueryKey,
      size: PER_PAGE,
      isSearched
    })

  function hasSeriesPlaylist(playlist: SeriesPlaylist) {
    return seriesPlaylists.find((pl) => pl.seriesId === playlist.seriesId)
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
        <Box>
          <SearchResultHeader searchResultCount={data.pages[0].count} />

          {data?.pages.map(({ result }) =>
            result.map((playlist) => {
              if (hasSeriesPlaylist(playlist)) {
                return null
              }

              return (
                <SearchResultRow
                  key={nanoid()}
                  onClick={() => {
                    addSeriesPlaylist(playlist)
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
