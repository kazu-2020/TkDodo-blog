import { UseFormSetValue } from 'react-hook-form/dist/types/form'
import { useFormContext, UseFormGetValues } from 'react-hook-form'
import React from 'react'
import { Box, Text } from '@chakra-ui/react'

import { EpisodeData } from '@/types/episode_data'
import { PlaylistFormInputs } from '@/features/playlists/types'
import { usePlaylistFormStore } from '@/features/playlists/stores/playlistForm'
import { SearchResultRow } from '@/features/playlists/components/PlaylistForm/ListTab/SearchResultRow'
import { SearchResultLoadMoreButton } from '@/features/playlists/components/PlaylistForm/ListTab/SearchResultLoadMoreButton'
import { SearchResultHeader } from '@/features/playlists/components/PlaylistForm/ListTab/SearchResultHeader'
import { SearchForm } from '@/features/playlists/components/PlaylistForm/ListTab/SearchForm'
import { useSearchEpisodes } from '@/features/playlists/api/getEpisodes'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'

const PER_PAGE = 10

const addEpisode = (
  getValues: UseFormGetValues<PlaylistFormInputs>,
  setValue: UseFormSetValue<any>,
  episode: EpisodeData
) => {
  const episodes = getValues('episodes')
  setValue('episodes', [...episodes, { ...episode }], { shouldDirty: true })
}

export const SearchEpisode = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchQueryKey,
    setSearchQueryKey,
    isSearched,
    setSearched
  } = usePlaylistFormStore((state) => ({
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
    searchQueryKey: state.searchQueryKey,
    setSearchQueryKey: state.setSearchQueryKey,
    isSearched: state.isSearched,
    setSearched: state.setSearched
  }))
  const { getValues, setValue } = useFormContext<PlaylistFormInputs>()

  const onSearched = (q: string) => {
    setSearchQuery(q)
    setSearched(true)
  }

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSearchEpisodes({
      query: searchQuery,
      queryKey: searchQueryKey,
      size: PER_PAGE,
      isSearched
    })

  function hasEpisode(episode: EpisodeData) {
    return getValues('episodes').find((ep) => ep.id === episode.id)
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
        <Box data-testid="series-playlist-search-results">
          <SearchResultHeader searchResultCount={data.pages[0].count} />

          {data?.pages.map(({ result }) =>
            result?.map((episode) => {
              if (hasEpisode(episode)) {
                return null
              }

              return (
                <SearchResultRow
                  key={episode.id}
                  onClick={() => {
                    addEpisode(getValues, setValue, episode)
                  }}
                  playlist={episode}
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
