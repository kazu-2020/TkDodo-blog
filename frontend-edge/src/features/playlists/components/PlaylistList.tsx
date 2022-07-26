import { ChangeEvent, useState } from 'react'
import { Box, Flex, Grid, GridItem, Stack } from '@chakra-ui/react'

import { PlaylistListItems } from '@/features/playlists/components/PlaylistListItems'
import { ArticleModeSwitch } from '@/features/playlists/components/ArticleModeSwitch'
import { SearchTextInput } from '@/components/SearchTextInput'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'
import { APIStatusSelect } from '@/components/APIStatusSelect'
import { NoDataFound } from '@/components/Alert'

import { usePlaylists } from '../api/getPlaylists'

export const PlaylistList = () => {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [apiState, setApiState] = useState('open')
  const [isArticle, setIsArticle] = useState(false)

  const { data, isLoading } = usePlaylists({
    query,
    apiState,
    page
  })

  const playlists = data?.playlists
  const totalCount = data?.pagination?.count || 0

  return (
    <Stack>
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={5}>
          <SearchTextInput
            placeholder="プレイリストタイトルで検索"
            onAction={setQuery}
          />
        </GridItem>

        <GridItem colStart={9} colEnd={13}>
          <Flex justify="flex-end">
            <ArticleModeSwitch onChange={setIsArticle} />
            <APIStatusSelect onChange={setApiState} />
          </Flex>
        </GridItem>
      </Grid>

      {isLoading && <ListScreenSkeleton />}
      {!isLoading && totalCount === 0 && (
        <Box pt={20}>
          <NoDataFound />
        </Box>
      )}
      {!isLoading && totalCount > 0 && (
        <PlaylistListItems
          items={playlists}
          page={page}
          totalCount={totalCount}
          isArticle={isArticle}
          onChangePage={setPage}
        />
      )}
    </Stack>
  )
}
