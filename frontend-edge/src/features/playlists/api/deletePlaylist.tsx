import { useMutation } from '@tanstack/react-query'

import { MutationConfig } from '@/lib/react-query'
import axios from '@/lib/axios'

export const deletePlaylist = async ({
  playlistId
}: {
  playlistId: string
}) => {
  await axios.delete(`/playlists/${playlistId}`)
}

type UseDeletePlaylistOptions = {
  config?: MutationConfig<typeof deletePlaylist>
}

export const useDeletePlaylist = ({ config }: UseDeletePlaylistOptions = {}) =>
  useMutation({
    mutationFn: deletePlaylist,
    ...config
  })
