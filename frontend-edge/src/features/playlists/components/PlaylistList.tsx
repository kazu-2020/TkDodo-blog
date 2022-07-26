import { ChangeEvent, useState } from 'react'
import { Box, Flex, Grid, GridItem, Stack } from '@chakra-ui/react'

import PlaylistListItems from '@/features/playlists/components/PlaylistListItems'
import ArticleModeSwitcher from '@/features/playlists/components/ArticleModeSwitch'
import SearchTextInput from '@/components/SearchTextInput/SearchTextInput'
import ListScreenSkeleton from '@/components/ListScreenSkeleton/ListScreenSkeleton'
import APIStatusSelect from '@/components/APIStatusSelect/APIStatusSelect'
import NoDataFound from '@/components/Alert/NoDataFound'

import { usePlaylists } from '../api/getPlaylists'

const PlaylistList = () => {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [apiState, setApiState] = useState('open')

  const { data, isLoading } = usePlaylists({
    query,
    apiState,
    page
  })

  const playlists = data?.playlists
  const totalCount = data?.pagination?.count || 0

  return (
    <Stack>
      <Grid templateColumns="repeat(5, 1fr)" gap={6}>
        <GridItem colSpan={2}>
          <SearchTextInput
            placeholder="プレイリストタイトルで検索"
            onAction={setQuery}
          />
        </GridItem>

        <GridItem colStart={4} colEnd={6}>
          <Flex justify="flex-end">
            {/* 記事モード作成までは無効化 */}
            {false && <ArticleModeSwitcher />}

            <APIStatusSelect
              onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                setApiState(event.target.value)
              }}
            />
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
          onChangePage={setPage}
        />
      )}
    </Stack>
  )
}
export default PlaylistList
