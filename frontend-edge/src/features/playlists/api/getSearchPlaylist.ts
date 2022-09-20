import { useInfiniteQuery } from 'react-query'

import { Playlist } from '@/types/playlist'
import axios from '@/lib/axios'

export type Response = {
  items: Playlist[]
  total: number
}

type Params = {
  word?: string
  concern?: string
  keyword?: string
  offset: number
  ignoreRange?: boolean
  size: number
  filterService?: boolean
}

const createSearchTextParams = (params: Params) => {
  if (params.word) {
    return { word: params.word }
  }

  if (params.concern) {
    return { concern: params.concern }
  }

  if (params.keyword) {
    return { keyword: params.keyword }
  }

  return {}
}

const createIgnoreRangeParams = (params: Params) => {
  if (params.ignoreRange) {
    return { ignore_range: params.ignoreRange }
  }

  return {}
}

const createFilterServiceParams = (params: Params) => {
  if (params.filterService) {
    return { service: 'g1,g2,e1,e3' }
  }
  return {}
}

export const getSearchPlaylist = async (params: Params): Promise<Response> => {
  const res = await axios.get('/episodes/search', {
    params: {
      offset: params.offset,
      size: params.size,
      contents_type: 'nplaylist',
      ...createSearchTextParams(params),
      ...createIgnoreRangeParams(params),
      ...createFilterServiceParams(params)
    }
  })
  return res.data
}

export const useSearchPlaylist = (params: Params) =>
  useInfiniteQuery<Response, Error>(
    ['playlist-search', params],
    ({ pageParam = 0 }) => getSearchPlaylist({ ...params, offset: pageParam }),
    {
      keepPreviousData: true,
      enabled: false,
      getNextPageParam: (lastPage, pages) => {
        if (pages.length * 10 < lastPage.total) {
          return pages.length * 10
        }
        return undefined
      }
    }
  )
