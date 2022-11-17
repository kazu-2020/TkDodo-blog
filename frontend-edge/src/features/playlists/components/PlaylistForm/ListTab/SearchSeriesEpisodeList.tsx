import { UseInfiniteQueryResult } from 'react-query'
import React from 'react'
import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import { ChevronLeftIcon } from '@chakra-ui/icons'

import { SeriesData } from '@/types/series_data'
import { EpisodeData } from '@/types/episode_data'
import { SearchResultLoadMoreButton } from '@/features/playlists/components/PlaylistForm/ListTab/SearchResultLoadMoreButton'
import { SearchEpisodeItems } from '@/features/playlists/components/PlaylistForm/ListTab/SearchEpisodeItems'
import { EpisodeHeader } from '@/features/playlists/components/PlaylistForm/ListTab/EpisodeHeader'
import {
  Response,
  useSearchEpisode
} from '@/features/playlists/api/getSearchEpisode'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'
import { NoDataFound } from '@/components/Alert'

type Props = {
  isOpen: boolean
  onClickBack: () => void
  onClick: (episode: EpisodeData) => void
  selectedSeries?: SeriesData
}

const isNewFetching = (query: UseInfiniteQueryResult<Response, Error>) =>
  query.isLoading || (query.isFetching && !query.isFetchingNextPage)

export const SearchSeriesEpisodeList = ({
  isOpen,
  selectedSeries,
  onClickBack,
  onClick
}: Props) => {
  const episodeQuery = useSearchEpisode(
    {
      seriesId: selectedSeries?.id,
      offset: 0,
      size: 10
    },
    true
  )
  const episodeCount = episodeQuery.data?.pages?.at(0)?.total || 0

  return (
    <Box>
      <HStack
        onClick={onClickBack}
        cursor="pointer"
        borderTop="1px"
        borderBottom="1px"
        h={14}
        borderColor="gray.200"
      >
        <ChevronLeftIcon h="20px" w="20px" color="#009688" />
        <Text fontSize="xs" fontWeight="bold">
          {selectedSeries?.name}
        </Text>
      </HStack>
      <VStack p={0}>
        <EpisodeHeader />

        {!isNewFetching(episodeQuery) && episodeCount === 0 && (
          <Box>
            <NoDataFound target="エピソード" />
          </Box>
        )}

        {isOpen && !isNewFetching(episodeQuery) && episodeCount > 0 && (
          <Box w="100%">
            {episodeQuery.data?.pages.map(({ items }) => (
              <SearchEpisodeItems
                key={items[0].id}
                items={items}
                onClick={onClick}
              />
            ))}
          </Box>
        )}

        {isNewFetching(episodeQuery) && (
          <Box w="100%">
            <ListScreenSkeleton size={10} />
          </Box>
        )}

        {episodeQuery.hasNextPage && (
          <SearchResultLoadMoreButton
            perPage={10}
            onClick={() => episodeQuery.fetchNextPage()}
            isLoading={episodeQuery.isFetchingNextPage}
          />
        )}
      </VStack>
    </Box>
  )
}
