import { UseFormSetValue } from 'react-hook-form/dist/types/form'
import { useFormContext, UseFormGetValues } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { Alert, AlertIcon, AlertTitle, Box, Text } from '@chakra-ui/react'

import { RecommendPlaylist } from '@/types/recommend_playlist'
import { SearchResultLoadMoreButton } from '@/features/series-decks/components/SeriesDeckForm'
import { RecommendDeckFormInputs } from '@/features/recommend-decks/types'
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

const addRecommendPlaylist = (
  getValues: UseFormGetValues<RecommendDeckFormInputs>,
  setValue: UseFormSetValue<any>,
  playlist: RecommendPlaylist
) => {
  const playlists = getValues('playlists') || []
  setValue('playlists', [...playlists, { ...playlist }], { shouldDirty: true })
}

const hasRecommendPlaylist = (
  getValues: UseFormGetValues<RecommendDeckFormInputs>,
  playlist: RecommendPlaylist
) => {
  const playlists = getValues('playlists') || []
  return playlists.some((pl) => pl.playlistUid === playlist.playlistUid)
}

export const RecommendPlaylistList = () => {
  const { getValues, setValue } = useFormContext<RecommendDeckFormInputs>()

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
                  key={playlist.playlistUid}
                  hasRecommendPlaylist={hasRecommendPlaylist(
                    getValues,
                    playlist
                  )}
                  playlist={playlist}
                  onClick={() =>
                    addRecommendPlaylist(getValues, setValue, playlist)
                  }
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

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  describe('createQueryParams', () => {
    it('指定したパラメータが設定されていること', () => {
      const params = createQueryParams({ query: 'test' })
      expect(params.query).toEqual('test')
      expect(params.per).toEqual(PER_PAGE)
      expect(params.withEpisodeCount).toEqual(1)
    })
  })
}
