import { UseInfiniteQueryResult } from 'react-query'
import { Box, VStack } from '@chakra-ui/react'

import { SeriesData } from '@/types/series_data'
import { SeriesHeader } from '@/features/playlists/components/PlaylistForm/ListTab/SerieseHeader'
import { SearchSeriesItems } from '@/features/playlists/components/PlaylistForm/ListTab/SearchSeriesItems'
import { SearchResultLoadMoreButton } from '@/features/playlists/components/PlaylistForm/ListTab/SearchResultLoadMoreButton'
import { SearchResultCount } from '@/features/playlists/components/PlaylistForm/ListTab/SearchResultCount'
import { Response } from '@/features/playlists/api/getSearchSeries'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'
import { NoDataFound } from '@/components/Alert'

type Props = {
  onClick: (item: SeriesData) => void
  isOpenEpisodes: boolean
  query: UseInfiniteQueryResult<Response, Error>
}

type QueryFetching = {
  isLoading: boolean
  isFetching: boolean
  isFetchingNextPage: boolean
}

const isNewFetching = (query: QueryFetching) =>
  query.isLoading || (query.isFetching && !query.isFetchingNextPage)

export const SearchSeriesSeriesList = ({
  query,
  isOpenEpisodes,
  onClick
}: Props) => {
  const seriesCount = query.data?.pages?.at(0)?.total || 0

  return (
    <Box>
      <VStack pt={0} pb={3}>
        <SearchResultCount count={seriesCount} />
        <SeriesHeader />
        {!isNewFetching(query) && seriesCount === 0 && (
          <Box w="100%">
            <NoDataFound target="シリーズ" />
          </Box>
        )}

        {!isOpenEpisodes && !isNewFetching(query) && seriesCount > 0 && (
          <Box w="100%">
            {query.data?.pages.map(({ items }) => (
              <SearchSeriesItems
                key={items[0].id}
                items={items}
                onClick={(item) => onClick(item)}
              />
            ))}
          </Box>
        )}

        {isNewFetching(query) && (
          <Box w="100%">
            <ListScreenSkeleton size={10} />
          </Box>
        )}

        {query.hasNextPage && (
          <SearchResultLoadMoreButton
            perPage={10}
            onClick={() => query.fetchNextPage()}
            isLoading={query.isFetchingNextPage}
          />
        )}
      </VStack>
    </Box>
  )
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  describe('isNewFetching', () => {
    it('ローディングしていないとき', () => {
      const query = {
        isLoading: false,
        isFetching: false,
        isFetchingNextPage: false
      }
      expect(isNewFetching(query)).toBeFalsy()
    })

    it('最初のページをローディングしているとき', () => {
      const query = {
        isLoading: true,
        isFetching: true,
        isFetchingNextPage: false
      }
      expect(isNewFetching(query)).toBeTruthy()
    })

    it('最初のページをローディングしているとき（キャッシュから）', () => {
      const query = {
        isLoading: false,
        isFetching: true,
        isFetchingNextPage: false
      }
      expect(isNewFetching(query)).toBeTruthy()
    })

    it('次のページをローディングしているとき', () => {
      const query = {
        isLoading: false,
        isFetching: true,
        isFetchingNextPage: true
      }
      expect(isNewFetching(query)).toBeFalsy()
    })
  })
}
