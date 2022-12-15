import { useQuery } from '@tanstack/react-query'

import axios from '@/lib/axios'

type BundleItems = {
  eventCount: number
  faqpageCount: number
  howtoCount: number
  recipeCount: number
  tvepisodeCount: number
}

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
  useQuery(['bundle-items', playlistUid], () => getBundleItems(playlistUid), {
    useErrorBoundary: false
  })
