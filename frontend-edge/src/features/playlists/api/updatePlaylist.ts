import snakecaseKeys from 'snakecase-keys'
import { useMutation } from '@tanstack/react-query'

import { Playlist } from '@/types/playlist'
import { MutationConfig } from '@/lib/react-query'
import axios from '@/lib/axios'
import { UpdatePlaylistParams } from '@/features/playlists/types'

export type UpdatePlaylistDTO = {
  data: UpdatePlaylistParams
  playlistUid: string
}

const requestParams = (data: UpdatePlaylistParams) => ({
  playlist: snakecaseKeys(data, { exclude: ['_destroy'] }),
  enable_list_update: data?.items ? 1 : 0
})

export const updatePlaylist = async ({
  data,
  playlistUid
}: UpdatePlaylistDTO): Promise<Playlist> => {
  const res = await axios.patch(
    `/playlists/${playlistUid}`,
    requestParams(data)
  )

  return {
    ...res.data,
    playlistUid: res.data.playlistUid
  }
}

type UseUpdatePlaylistOptions = {
  config?: MutationConfig<typeof updatePlaylist>
}

export const useUpdatePlaylist = ({ config }: UseUpdatePlaylistOptions) =>
  useMutation({
    mutationFn: updatePlaylist,
    ...config
  })
