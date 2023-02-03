import { useMutation } from '@tanstack/react-query'

import { Playlist } from '@/types/playlist'
import { MutationConfig, queryClient } from '@/lib/react-query'
import axios from '@/lib/axios'

export const deletePlaylist = async ({
  playlistId
}: {
  playlistId: string
}) =>
  axios.delete(`/playlists/${playlistId}`)


type UseDeletePlaylistOptions = {
  config?: MutationConfig<typeof deletePlaylist>
}

export const useDeletePlaylist = ({ config }: UseDeletePlaylistOptions = {}) =>
  useMutation({
    onMutate: async (deletedPlaylist) => {
      await queryClient.cancelQueries(['playlist'])

      const previousPlaylists = queryClient.getQueryData<Playlist[]>([
        'playlist'
      ])

      queryClient.setQueryData(
        ['playlist'],
        previousPlaylists?.filter(
          (playlist) => playlist.playlistUid !== deletedPlaylist.playlistId
        )
      )

      return { previousPlaylists }
    },
    onError: (_, __, context: any) => {
      if (context?.previousPlaylists) {
        queryClient.setQueryData(['playlist'], context.previousPlaylists)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['playlist'])
    },
    mutationFn: deletePlaylist,
    ...config
  })
