import { useQuery } from 'react-query'

import { ExtractFnReturnType } from '@/lib/react-query'
import axios from '@/lib/axios'

type BundleItems = {
  eventCount: number
  faqpageCount: number
  howtoCount: number
  recipeCount: number
  tvepisodeCount: number
}

type QueryFnType = typeof getBundleItems

export const getBundleItems = async (
  playlistUId: string | undefined
): Promise<BundleItems> => {
  if (typeof playlistUId === undefined) {
    return Promise.reject(new Error('Invalid id'))
  }
  return axios.get(`playlists/${playlistUId}/bundle_items`)
}

export const useBundleItems = (playlistUId: string | undefined) =>
  useQuery<ExtractFnReturnType<QueryFnType>>(
    ['bundle-items', playlistUId],
    () => axios.get(`playlists/${playlistUId}/bundle_items`),
    {
      enabled: Boolean(playlistUId),
      useErrorBoundary: false
    }
  )
