import snakecaseKeys from 'snakecase-keys'
import { useMutation } from 'react-query'
import { useToast } from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import { MutationConfig, queryClient } from '@/lib/react-query'
import axios from '@/lib/axios'

type PlaylistParams = {
  name?: string
  interfix?: string
  description?: string
  apiState?: boolean
  adminMemo?: string
  items?: string[]
  enableListUpdate: boolean
}

export type UpdatePlaylistDTO = {
  data: PlaylistParams
  playlistId: string
}

const requestParams = (data: PlaylistParams) => {
  if (Object.hasOwn(data, 'apiState')) {
    const { apiState, ...params } = data
    return {
      playlist: snakecaseKeys({
        ...params,
        apiState: data.apiState ? 'open' : 'close'
      }),
      enable_list_update: data.enableListUpdate ? '1' : ''
    }
  }

  return { playlist: snakecaseKeys(data) }
}

export const updatePlaylist = async ({
  data,
  playlistId
}: UpdatePlaylistDTO): Promise<Playlist> => {
  const res = await axios.patch(`/playlists/${playlistId}`, requestParams(data))

  return {
    ...res.data.playlist,
    // FIXME: レスポンスのidが数値になっていて、queryKeyに影響が出てしまうのでのでキャストしてる
    // ex. ['playlist', 33] ['playlist', "33"] は別のキャッシュとして扱われる
    id: `${res.data.playlist.id}`
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
        updatingPlaylist?.playlistId
      ])

      const previousPlaylist = queryClient.getQueryData<Playlist>([
        'playlist',
        updatingPlaylist?.playlistId
      ])

      queryClient.setQueryData(['playlist', updatingPlaylist?.playlistId], {
        ...previousPlaylist,
        ...updatingPlaylist.data,
        id: updatingPlaylist?.playlistId
      })

      return { previousPlaylist }
    },
    onError: (_, __, context: any) => {
      if (context?.previousPlaylist) {
        queryClient.setQueryData(
          ['playlist', context.previousPlaylist.id],
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
      queryClient.refetchQueries(['playlist', data.id])
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
