import { UseInfiniteQueryResult } from 'react-query'
import React from 'react'
import { Box, VStack } from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import { SeriesHeader } from '@/features/playlists/components/PlaylistForm/ListTab/SerieseHeader'
import { SearchResultLoadMoreButton } from '@/features/playlists/components/PlaylistForm/ListTab/SearchResultLoadMoreButton'
import { SearchResultCount } from '@/features/playlists/components/PlaylistForm/ListTab/SearchResultCount'
import { SearchPlaylistItems } from '@/features/playlists/components/PlaylistForm/ListTab/SearchPlaylistItems'
import { Response } from '@/features/playlists/api/getSearchPlaylist'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'
import { NoDataFound } from '@/components/Alert'

type Props = {
  onClick: (item: Playlist) => void
  query: UseInfiniteQueryResult<Response, Error>
}

export const SearchPlaylistPlaylistList = ({ query, onClick }: Props) => {
  const playlistCount = query.data?.pages?.at(0)?.total || 0

  return (
    <Box>
      <VStack pt={0} pb={3}>
        <SearchResultCount count={playlistCount} />
        <SeriesHeader />
        {!query.isLoading && !query.isFetching && playlistCount === 0 && (
          <Box>
            <NoDataFound />
          </Box>
        )}

        {!query.isLoading && !query.isFetching && playlistCount > 0 && (
          <Box w="100%">
            {query.data?.pages.map(({ items }) => (
              <SearchPlaylistItems
                key={items[0].id}
                items={items}
                onClick={(item) => onClick(item)}
              />
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
