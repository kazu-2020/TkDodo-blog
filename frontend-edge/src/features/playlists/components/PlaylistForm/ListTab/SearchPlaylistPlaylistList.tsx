import { UseInfiniteQueryResult } from 'react-query'
import React from 'react'
import { Box, VStack } from '@chakra-ui/react'

import { isNewFetching } from '@/utils/queryResult'
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
  isOpenEpisodes: boolean
  query: UseInfiniteQueryResult<Response, Error>
}

export const SearchPlaylistPlaylistList = ({
  query,
  isOpenEpisodes,
  onClick
}: Props) => {
  const playlistCount = query.data?.pages?.at(0)?.total || 0

  return (
    <Box>
      <VStack pt={0} pb={3}>
        <SearchResultCount count={playlistCount} />
        <SeriesHeader />
        {!isNewFetching(query) && playlistCount === 0 && (
          <Box w="100%">
            <NoDataFound target="プレイリスト" />
          </Box>
        )}

        {!isOpenEpisodes && !isNewFetching(query) && playlistCount > 0 && (
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
