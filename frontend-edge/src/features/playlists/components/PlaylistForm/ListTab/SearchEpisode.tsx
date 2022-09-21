import { UseInfiniteQueryResult } from 'react-query'
import React from 'react'
import { Box, VStack } from '@chakra-ui/react'

import { SearchResultLoadMoreButton } from '@/features/playlists/components/PlaylistForm/ListTab/SearchResultLoadMoreButton'
import { SearchResultCount } from '@/features/playlists/components/PlaylistForm/ListTab/SearchResultCount'
import { SearchEpisodeItems } from '@/features/playlists/components/PlaylistForm/ListTab/SearchEpisodeItems'
import { EpisodeHeader } from '@/features/playlists/components/PlaylistForm/ListTab/EpisodeHeader'
import { Response } from '@/features/playlists/api/getSearchEpisode'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'
import { NoDataFound } from '@/components/Alert'

type Props = {
  query: UseInfiniteQueryResult<Response, Error>
}

export const SearchEpisode = ({ query }: Props) => {
  const totalCount = query.data?.pages?.at(0)?.total || 0
  return (
    <Box p={0}>
      <VStack p={0}>
        <SearchResultCount count={totalCount} />
        <EpisodeHeader />

        {!query.isLoading && !query.isFetching && totalCount === 0 && (
          <Box w="100%">
            <NoDataFound />
          </Box>
        )}

        {!query.isLoading && totalCount > 0 && (
          <Box w="100%">
            {query.data?.pages.map(({ items }) => (
              <SearchEpisodeItems key={items[0].id} items={items} />
            ))}
          </Box>
        )}

        {(query.isLoading || query.isFetching) && (
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
