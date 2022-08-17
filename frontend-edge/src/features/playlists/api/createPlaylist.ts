import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { useToast } from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import { MutationConfig, queryClient } from '@/lib/react-query'
import axios from '@/lib/axios'

export type CreatePlaylistDTO = {
  data: {
    name: string
    interfix: string
    description: string
    apiState: boolean
    items?: string[]
  }
}

export const createPlaylist = ({
  data
}: CreatePlaylistDTO): Promise<Playlist> => axios.post(`/playlists`, data)

type UseCreatePlaylistOptions = {
  config?: MutationConfig<typeof createPlaylist>
}

export const useCreatePlaylist = ({
  config
}: UseCreatePlaylistOptions = {}) => {
  const navigate = useNavigate()
  const toast = useToast()

  return useMutation({
    onMutate: async (newPlaylist) => {
      await queryClient.cancelQueries('playlists')

      const previousPlaylists =
        queryClient.getQueryData<Playlist[]>('playlists')

      queryClient.setQueryData('playlists', [
        ...(previousPlaylists || []),
        newPlaylist.data
      ])

      return { previousPlaylists }
    },
    onError: (_, __, context: any) => {
      if (context?.previousPlaylists) {
        queryClient.setQueryData('playlists', context.previousPlaylists)
      }
      toast({
        title: '新規作成に失敗しました。',
        status: 'error',
        isClosable: true,
        position: 'top-right'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries('playlists')
      navigate(`/playlists`)
      toast({
        title: '作成しました。',
        status: 'success',
        isClosable: true,
        position: 'top-right'
      })
    },
    ...config,
    mutationFn: createPlaylist
  })
}
