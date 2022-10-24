import { UseFormSetValue } from 'react-hook-form/dist/types/form'
import { useFormContext, UseFormGetValues } from 'react-hook-form'
import React from 'react'
import { Alert, AlertIcon, AlertTitle, Box } from '@chakra-ui/react'

import { SeriesPlaylist } from '@/types/series_playlist'
import { SeriesDeckFormInputs } from '@/features/series-decks/types'
import { useSeriesDeckFormStore } from '@/features/series-decks/stores/seriesDeckForm'
import { SearchResultRow } from '@/features/series-decks/components/SeriesDeckForm/SearchResultRow'
import { SearchResultLoadMoreButton } from '@/features/series-decks/components/SeriesDeckForm/SearchResultLoadMoreButton'
import { SearchResultHeader } from '@/features/series-decks/components/SeriesDeckForm/SearchResultHeader'
import { SearchForm } from '@/features/series-decks/components/SeriesDeckForm/SearchForm'
import { useSearchSeriesPlaylists } from '@/features/series-decks/api/getSeriesPlaylists'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'
import { StartSearch } from '@/components/Alert'

const PER_PAGE = 10

const addSeriesPlaylist = (
  getValues: UseFormGetValues<SeriesDeckFormInputs>,
  setValue: UseFormSetValue<any>,
  playlist: SeriesPlaylist
) => {
  const playlists = getValues('playlists') || []
  setValue('playlists', [...playlists, { ...playlist }], { shouldDirty: true })
}

const hasSeriesPlaylist = (
  getValues: UseFormGetValues<SeriesDeckFormInputs>,
  playlist: SeriesPlaylist
) => {
  const playlists = getValues('playlists') || []
  return playlists.some((pl) => pl.seriesId === playlist.seriesId)
}

export const SearchSeriesPlaylist = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchQueryKey,
    setSearchQueryKey,
    isSearched,
    setSearched
  } = useSeriesDeckFormStore((state) => ({
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
    searchQueryKey: state.searchQueryKey,
    setSearchQueryKey: state.setSearchQueryKey,
    isSearched: state.isSearched,
    setSearched: state.setSearched
  }))

  const { getValues, setValue } = useFormContext<SeriesDeckFormInputs>()

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

      {!isSearched && (
        <Box w="100%" py={10}>
          <StartSearch />
        </Box>
      )}

      {/* 検索結果 */}
      {isSearched && isLoading && <ListScreenSkeleton size={PER_PAGE} />}
      {isSearched && !isLoading && (!data || data.pages[0].count <= 0) && (
        <Box w="100%" py={10}>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>編成可能なシリーズがありません</AlertTitle>
          </Alert>
        </Box>
      )}
      {isSearched && !isLoading && data && data.pages[0].count > 0 && (
        <Box data-testid="series-playlist-search-results">
          <SearchResultHeader searchResultCount={data.pages[0].count} />

          {data?.pages.map(({ result }) =>
            result?.map((playlist) => (
              <SearchResultRow
                key={playlist.seriesId}
                hasSeriesPlaylist={hasSeriesPlaylist(getValues, playlist)}
                onClick={() => {
                  addSeriesPlaylist(getValues, setValue, playlist)
                }}
                playlist={playlist}
              />
            ))
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
