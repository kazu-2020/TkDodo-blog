import snakecaseKeys from 'snakecase-keys'
import { useMutation } from 'react-query'
import { useToast } from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import { MutationConfig, queryClient } from '@/lib/react-query'
import axios from '@/lib/axios'
import { UpdatePlaylistParams } from '@/features/playlists/types'

export type UpdatePlaylistDTO = {
  data: UpdatePlaylistParams
  playlistUId: string
}

const requestParams = (data: UpdatePlaylistParams) => ({
  playlist: snakecaseKeys(data, { exclude: ['_destroy'] })
})

export const updatePlaylist = async ({
  data,
  playlistUId
}: UpdatePlaylistDTO): Promise<Playlist> => {
  const res = await axios.patch(
    `/playlists/${playlistUId}`,
    requestParams(data)
  )

  return {
    ...res.data.playlist,
    playlistUId: res.data.playlist.playlistUId
  }
}

type UseUpdatePlaylistOptions = {
  config?: MutationConfig<typeof updatePlaylist>
}

export const useUpdatePlaylist = ({
  config
}: UseUpdatePlaylistOptions = {}) => {
  const toast = useToast()

  return useMutation({
    onMutate: async (updatingPlaylist) => {
      await queryClient.cancelQueries([
        'playlist',
        updatingPlaylist?.playlistUId
      ])

      const previousPlaylist = queryClient.getQueryData<Playlist>([
        'playlist',
        updatingPlaylist?.playlistUId
      ])

      queryClient.setQueryData(['playlist', updatingPlaylist?.playlistUId], {
        ...previousPlaylist,
        ...updatingPlaylist.data,
        playlistUId: updatingPlaylist?.playlistUId
      })

      return { previousPlaylist }
    },
    onError: (_, __, context: any) => {
      if (context?.previousPlaylist) {
        queryClient.setQueryData(
          ['playlist', context.previousPlaylist.playlistUId],
          context.previousPlaylist
        )
      }
      toast({
        title: '保存に失敗しました。',
        status: 'error',
        isClosable: true,
        position: 'top-right'
      })
    },
    onSuccess: (data) => {
      queryClient.refetchQueries(['playlist', data.playlistUId])
      toast({
        title: '保存しました。',
        status: 'success',
        isClosable: true,
        position: 'top-right'
      })
    },
    ...config,
    mutationFn: updatePlaylist
  })
}
