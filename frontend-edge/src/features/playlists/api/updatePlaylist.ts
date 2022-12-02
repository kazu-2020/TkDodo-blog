import snakecaseKeys from 'snakecase-keys'
import { useMutation } from 'react-query'
import { useToast } from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import { MutationConfig, queryClient } from '@/lib/react-query'
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

export const useUpdatePlaylist = ({
  config
}: UseUpdatePlaylistOptions = {}) => {
  const toast = useToast()

  return useMutation({
    onMutate: async (updatingPlaylist) => {
      await queryClient.cancelQueries([
        'playlist',
        updatingPlaylist?.playlistUid
      ])

      const previousPlaylist = queryClient.getQueryData<Playlist>([
        'playlist',
        updatingPlaylist?.playlistUid
      ])

      queryClient.setQueryData(['playlist', updatingPlaylist?.playlistUid], {
        ...previousPlaylist,
        ...updatingPlaylist.data,
        playlistUid: updatingPlaylist?.playlistUid
      })

      return { previousPlaylist }
    },
    onError: (_, __, context: any) => {
      if (context?.previousPlaylist) {
        queryClient.setQueryData(
          ['playlist', context.previousPlaylist.playlistUid],
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
      queryClient.refetchQueries(['playlist', data.playlistUid])
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
