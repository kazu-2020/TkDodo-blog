import { useInfiniteQuery } from '@tanstack/react-query'

import { EpisodeData } from '@/types/episode_data'
import axios from '@/lib/axios'

export type Response = {
  items: EpisodeData[]
  total: number
}

type Params = {
  word?: string
  concern?: string
  keyword?: string
  offset: number
  ignoreRange?: boolean
  size: number
  orderBy?: string
  order?: string
  filterService?: boolean
  playlistId?: string
  seriesId?: string
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

const createOrderParams = (params: Params) => {
  if (params.orderBy && params.order) {
    return { order_by: params.orderBy, order: params.order }
  }

  return {}
}

const createFilterService = (params: Params) => {
  if (params.filterService) {
    return { service: 'g1,g2,e1,e3' }
  }
  return {}
}

const createSeriesIdParams = (params: Params) => {
  if (params.seriesId) {
    return { series_id: params.seriesId }
  }
  return {}
}

const createPlaylistIdParams = (params: Params) => {
  if (params.playlistId) {
    return { playlist_id: params.playlistId }
  }
  return {}
}

const createContentType = (params: Params) => {
  if (params.seriesId) {
    return { contents_type: 'tvseries' }
  }
  if (params.playlistId) {
    return { contents_type: 'nplaylist' }
  }
  return { contents_type: 'tvepisode' }
}

export const getSearchEpisode = async (params: Params): Promise<Response> => {
  const res = await axios.get('/episodes/search', {
    params: {
      offset: params.offset,
      size: params.size,
      ...createContentType(params),
      ...createSearchTextParams(params),
      ...createIgnoreRangeParams(params),
      ...createOrderParams(params),
      ...createFilterService(params),
      ...createPlaylistIdParams(params),
      ...createSeriesIdParams(params)
    }
  })
  return res.data
}

export const useSearchEpisode = (params: Params, enabled?: boolean) =>
  useInfiniteQuery<Response, Error>(
    ['episode-search', params],
    ({ pageParam = 0 }) => getSearchEpisode({ ...params, offset: pageParam }),
    {
      keepPreviousData: true,
      enabled: enabled || false,
      getNextPageParam: (lastPage, pages) => {
        if (pages.length * 10 < lastPage.total) {
          return pages.length * 10
        }
        return undefined
      }
    }
  )
