import { useState } from 'react'
import { Box, Flex, Grid, GridItem, Stack } from '@chakra-ui/react'

import SeriesDeckListItems from '@/features/series-decks/components/SeriesDeckListItems'
import { SearchTextInput } from '@/components/SearchTextInput'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'
import { APIStatusSelect } from '@/components/APIStatusSelect'
import { NoDataFound } from '@/components/Alert'

import { useSeriesDecks } from '../api/getSeriesDecks'

const SeriesDeckList = () => {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [apiState, setApiState] = useState('open')

  const { data, isLoading } = useSeriesDecks({
    query,
    apiState,
    page
  })

  const seriesDecks = data?.seriesDecks
  const totalCount = data?.pagination?.count || 0

  return (
    <Stack>
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={5}>
          <SearchTextInput
            placeholder="シリーズデッキタイトル・管理メモで検索"
            onAction={setQuery}
          />
        </GridItem>

        <GridItem colStart={9} colEnd={13}>
          <Flex justify="flex-end">
            <APIStatusSelect onChange={setApiState} />
          </Flex>
        </GridItem>
      </Grid>

      {isLoading && <ListScreenSkeleton />}
      {!isLoading && totalCount === 0 && (
        <Box pt={20}>
          <NoDataFound target="シリーズデッキ" />
        </Box>
      )}
      {!isLoading && totalCount > 0 && (
        <SeriesDeckListItems
          items={seriesDecks}
          page={page}
          totalCount={totalCount}
          onChangePage={setPage}
        />
      )}
    </Stack>
  )
}
export default SeriesDeckList
