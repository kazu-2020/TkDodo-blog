import React, { useEffect, useState } from 'react'
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'

import { SearchSeries } from '@/features/playlists/components/PlaylistForm/ListTab/SearchSeries'
import { SearchPlaylist } from '@/features/playlists/components/PlaylistForm/ListTab/SearchPlaylist'
import {
  FilterParams,
  SearchFilter
} from '@/features/playlists/components/PlaylistForm/ListTab/SearchFilter'
import { SearchEpisode } from '@/features/playlists/components/PlaylistForm/ListTab/SearchEpisode'
import { useSearchSeries } from '@/features/playlists/api/getSearchSeries'
import { useSearchPlaylist } from '@/features/playlists/api/getSearchPlaylist'
import { useSearchEpisode } from '@/features/playlists/api/getSearchEpisode'
import { SearchTextInput } from '@/components/SearchTextInput'
import { StartSearch } from '@/components/Alert'

type SearchQueryParams = {
  word?: string
  concern?: string
  keyword?: string
  ignoreRange: boolean
  offset: number
  filterService: boolean
  orderBy: string
  order: string
  size: number
}

const createQueryParams = (filter: any): SearchQueryParams => ({
  word: filter.searchTextType === 'word' ? filter.searchText : undefined,
  concern: filter.searchTextType === 'concern' ? filter.searchText : undefined,
  keyword: filter.searchTextType === 'keyword' ? filter.searchText : undefined,
  ignoreRange: filter.ignoreRange,
  offset: filter.offset,
  filterService: filter.filterService,
  orderBy: filter.orderBy,
  order: filter.order,
  size: 10
})

export const SearchForm = () => {
  const [filter, setFilter] = useState({
    tabIndex: 0,
    searchText: '',
    searchTextType: 'word',
    orderBy: '',
    order: '',
    filterService: false,
    ignoreRange: false,
    offset: 0,
    isSearch: false
  })

  const searchEpisodeQuery = useSearchEpisode(createQueryParams(filter))
  const searchSeriesQuery = useSearchSeries(createQueryParams(filter))
  const searchPlaylistQuery = useSearchPlaylist(createQueryParams(filter))

  useEffect(() => {
    if (filter.isSearch) {
      if (filter.tabIndex === 0) {
        searchEpisodeQuery.refetch()
      } else if (filter.tabIndex === 1) {
        searchSeriesQuery.refetch()
      } else if (filter.tabIndex === 2) {
        searchPlaylistQuery.refetch()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const onAction = (query: string) => {
    setFilter((prev) => ({
      ...prev,
      searchText: query,
      isSearch: true
    }))
  }

  return (
    <>
      <SearchTextInput placeholder="エピソードを検索する" onAction={onAction} />
      <Tabs
        onChange={(index) =>
          setFilter((prev) => ({
            ...prev,
            tabIndex: index
          }))
        }
      >
        <TabList>
          <Tab>エピソード</Tab>
          <Tab>シリーズ</Tab>
          <Tab>プレイリスト</Tab>
        </TabList>
        <SearchFilter
          tabIndex={filter.tabIndex}
          onChange={(params: FilterParams) => {
            setFilter((prev) => ({
              ...prev,
              ...params,
              isSearch: true
            }))
          }}
        />
        <TabPanels>
          <TabPanel p={0}>
            {filter.isSearch && <SearchEpisode query={searchEpisodeQuery} />}
            {!filter.isSearch && (
              <Box w="100%">
                <StartSearch />
              </Box>
            )}
          </TabPanel>
          <TabPanel p={0}>
            {filter.isSearch && <SearchSeries query={searchSeriesQuery} />}
            {!filter.isSearch && (
              <Box w="100%">
                <StartSearch />
              </Box>
            )}
          </TabPanel>
          <TabPanel p={0}>
            {filter.isSearch && <SearchPlaylist query={searchPlaylistQuery} />}
            {!filter.isSearch && (
              <Box w="100%">
                <StartSearch />
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}
