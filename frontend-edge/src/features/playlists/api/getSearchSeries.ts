import { useInfiniteQuery } from 'react-query'

import { SeriesData } from '@/types/series_data'
import axios from '@/lib/axios'

export type Response = {
  items: SeriesData[]
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

const createFilterService = (params: Params) => {
  if (params.filterService) {
    return { service: 'g1,g2,e1,e3' }
  }
  return {}
}

export const getSearchSeries = async (params: Params): Promise<Response> => {
  const res = await axios.get('/episodes/search', {
    params: {
      offset: params.offset,
      size: params.size,
      contents_type: 'tvseries',
      ...createSearchTextParams(params),
      ...createIgnoreRangeParams(params),
      ...createFilterService(params)
    }
  })
  return res.data
}

export const useSearchSeries = (params: Params) =>
  useInfiniteQuery<Response, Error>(
    ['series-search', params],
    ({ pageParam = 0 }) => getSearchSeries({ ...params, offset: pageParam }),
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
