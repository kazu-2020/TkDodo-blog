import { UseInfiniteQueryResult } from 'react-query'
import React, { useState } from 'react'
import { Box, useDisclosure, VStack } from '@chakra-ui/react'

import { isNewFetching } from '@/utils/queryResult'
import { EpisodeData } from '@/types/episode_data'
import { SearchResultLoadMoreButton } from '@/features/playlists/components/PlaylistForm/ListTab/SearchResultLoadMoreButton'
import { SearchResultCount } from '@/features/playlists/components/PlaylistForm/ListTab/SearchResultCount'
import { SearchEpisodeItems } from '@/features/playlists/components/PlaylistForm/ListTab/SearchEpisodeItems'
import { EpisodeHeader } from '@/features/playlists/components/PlaylistForm/ListTab/EpisodeHeader'
import { PlaylistEpisodeDrawer } from '@/features/playlists/components/PlaylistEpisodeDrawer'
import { Response } from '@/features/playlists/api/getSearchEpisode'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'
import { NoDataFound } from '@/components/Alert'

type Props = {
  query: UseInfiniteQueryResult<Response, Error>
}

export const SearchEpisode = ({ query }: Props) => {
  const {
    isOpen: isOpenEpisode,
    onOpen: onOpenEpisode,
    onClose: onCloseEpisode
  } = useDisclosure()
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeData>()

  const totalCount = query.data?.pages?.at(0)?.total || 0
  return (
    <Box p={0}>
      <VStack p={0}>
        <SearchResultCount count={totalCount} />
        <EpisodeHeader />

        {!isNewFetching(query) && totalCount === 0 && (
          <Box w="100%">
            <NoDataFound target="エピソード" />
          </Box>
        )}

        {!isNewFetching(query) && totalCount > 0 && (
          <Box w="100%">
            {query.data?.pages.map(({ items }) => (
              <SearchEpisodeItems
                key={items[0].id}
                items={items}
                onClick={(episode) => {
                  setSelectedEpisode(episode)
                  onOpenEpisode()
                }}
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
      {selectedEpisode && (
        <PlaylistEpisodeDrawer
          episode={selectedEpisode}
          isOpen={isOpenEpisode}
          onClose={onCloseEpisode}
        />
      )}
    </Box>
  )
}
