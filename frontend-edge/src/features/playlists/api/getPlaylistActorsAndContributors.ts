import { useQuery } from '@tanstack/react-query'

import { ActorAndContributor } from '@/types/actor_and_contributor'
import axios from '@/lib/axios'

export const getPlaylistActorsAndContributors = async (
  playlistUid: string | undefined
): Promise<ActorAndContributor> => {
  if (typeof playlistUid === undefined) {
    return Promise.reject(new Error('Invalid id'))
  }

  const res = await axios.get(
    `playlists/${playlistUid}/actors_and_contributors`
  )
  return res.data
}

export const usePlaylistActorsAndContributors = (
  playlistUid: string | undefined
) =>
  useQuery(
    ['actors-and-contributors', playlistUid],
    () => getPlaylistActorsAndContributors(playlistUid),
    {
      enabled: Boolean(playlistUid),
      useErrorBoundary: false
    }
  )
