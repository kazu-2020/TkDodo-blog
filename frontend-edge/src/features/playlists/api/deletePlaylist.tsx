import { useMutation } from 'react-query'
import { useToast } from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import { MutationConfig, queryClient } from '@/lib/react-query'
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

export const useDeletePlaylist = ({
  config
}: UseDeletePlaylistOptions = {}) => {
  const toast = useToast()

  return useMutation({
    onMutate: async (deletedPlaylist) => {
      await queryClient.cancelQueries('playlist')

      const previousPlaylists = queryClient.getQueryData<Playlist[]>('playlist')

      queryClient.setQueryData(
        'playlist',
        previousPlaylists?.filter(
          (playlist) => playlist.playlistUId !== deletedPlaylist.playlistId
        )
      )

      return { previousPlaylists }
    },
    onError: (_, __, context: any) => {
      if (context?.previousPlaylists) {
        queryClient.setQueryData('playlist', context.previousPlaylists)
      }
      toast({
        title: '削除に失敗しました。',
        status: 'error',
        isClosable: true,
        position: 'top-right'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries('playlist')
      toast({
        title: '削除しました。',
        status: 'success',
        isClosable: true,
        position: 'top-right'
      })
    },
    ...config,
    mutationFn: deletePlaylist
  })
}
