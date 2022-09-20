import { UseInfiniteQueryResult } from 'react-query'
import { Box, Grid, GridItem, Text, VStack } from '@chakra-ui/react'

import { SearchResultLoadMoreButton } from '@/features/playlists/components/PlaylistForm/ListTab/SearchResultLoadMoreButton'
import { SearchEpisodeItems } from '@/features/playlists/components/PlaylistForm/ListTab/SearchEpisodeItems'
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
        <Grid
          templateColumns="repeat(36, 1fr)"
          gap={2}
          borderBottom="1px"
          borderColor="gray.200"
          fontSize="xs"
          fontWeight="bold"
          color="gray"
          p={2}
          w="100%"
        >
          <GridItem h="5" colSpan={3} />
          <GridItem colSpan={9} h="5" textAlign="left">
            <Text>エピソード</Text>
          </GridItem>
          <GridItem colSpan={5} h="5" textAlign="center">
            <Text>再生時間</Text>
          </GridItem>
          <GridItem colSpan={8} h="5" textAlign="left">
            <Text>シリーズ名</Text>
          </GridItem>
          <GridItem colSpan={6} h="5" textAlign="center">
            <Text>直近放送日</Text>
          </GridItem>
          <GridItem colSpan={5} h="5" textAlign="center">
            <Text>視聴可能</Text>
          </GridItem>
        </Grid>

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
