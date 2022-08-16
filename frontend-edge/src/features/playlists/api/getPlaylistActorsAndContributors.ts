import { useQuery } from 'react-query'

import { ActorAndContributor } from '@/types/actor_and_contributor'
import axios from '@/lib/axios'

export const getPlaylistActorsAndContributors = async (
  playlistUId: string | undefined
): Promise<ActorAndContributor> => {
  if (typeof playlistUId === undefined) {
    return Promise.reject(new Error('Invalid id'))
  }

  const res = await axios.get(
    `playlists/${playlistUId}/actors_and_contributors`
  )
  return res.data
}

export const usePlaylistActorsAndContributors = (
  playlistUId: string | undefined
) =>
  useQuery(
    ['actors-and-contributors', playlistUId],
    () => getPlaylistActorsAndContributors(playlistUId),
    {
      enabled: Boolean(playlistUId)
    }
  )
