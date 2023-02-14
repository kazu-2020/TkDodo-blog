import snakecaseKeys from 'snakecase-keys'
import { useMutation } from '@tanstack/react-query'

import { Playlist } from '@/types/playlist'
import { MutationConfig, queryClient } from '@/lib/react-query'
import axios from '@/lib/axios'
import { CreatePlaylistParams } from '@/features/playlists/types'

export type CreatePlaylistDTO = {
  data: CreatePlaylistParams
}

const requestParams = (data: CreatePlaylistParams) => ({
  playlist: snakecaseKeys(data, { exclude: ['_destroy'] }),
  enable_list_update: data?.items ? 1 : 0
})

export const createPlaylist = ({ data }: CreatePlaylistDTO) =>
  axios.post<Playlist>(`/playlists`, requestParams(data))

type UseCreatePlaylistOptions = {
  config?: MutationConfig<typeof createPlaylist>
}

export const useCreatePlaylist = ({ config }: UseCreatePlaylistOptions = {}) =>
  useMutation({
    onMutate: async (newPlaylist) => {
      await queryClient.cancelQueries(['playlists'])

      const previousPlaylists = queryClient.getQueryData<Playlist[]>([
        'playlists'
      ])

      queryClient.setQueryData(
        ['playlists'],
        [...(previousPlaylists || []), newPlaylist.data]
      )

      return { previousPlaylists }
    },
    onError: (_, __, context: any) => {
      if (context?.previousPlaylists) {
        queryClient.setQueryData(['playlists'], context.previousPlaylists)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['playlists'])
    },
    mutationFn: createPlaylist,
    ...config
  })
