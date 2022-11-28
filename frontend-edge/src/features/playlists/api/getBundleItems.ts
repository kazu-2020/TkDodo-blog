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
  playlistUid: string | undefined
): Promise<BundleItems> => {
  if (typeof playlistUid === undefined) {
    return Promise.reject(new Error('Invalid id'))
  }
  const res = await axios.get(`playlists/${playlistUid}/bundle_items`)
  return res.data
}

export const useBundleItems = (playlistUid: string | undefined) =>
  useQuery<ExtractFnReturnType<QueryFnType>>(
    ['bundle-items', playlistUid],
    () => getBundleItems(playlistUid),
    {
      enabled: Boolean(playlistUid),
      useErrorBoundary: false
    }
  )
