import snakecaseKeys from 'snakecase-keys'
import { useMutation } from '@tanstack/react-query'

import { Playlist } from '@/types/playlist'
import { MutationConfig } from '@/lib/react-query'
import axios from '@/lib/axios'
import { CreatePlaylistParams } from '@/features/playlists/types'

export type CreatePlaylistDTO = {
  data: CreatePlaylistParams
}

const requestParams = (data: CreatePlaylistParams) => ({
  playlist: snakecaseKeys(data, { exclude: ['_destroy'] }),
  enable_list_update: data?.items ? 1 : 0
})

export const createPlaylist = ({
  data
}: CreatePlaylistDTO): Promise<Playlist> =>
  axios.post(`/playlists`, requestParams(data))

type UseCreatePlaylistOptions = {
  config?: MutationConfig<typeof createPlaylist>
}

export const useCreatePlaylist = ({ config }: UseCreatePlaylistOptions) =>
  useMutation({
    mutationFn: createPlaylist,
    ...config
  })
