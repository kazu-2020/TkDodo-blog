import { useNavigate } from 'react-router-dom'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useMemo } from 'react'
import { DevTool } from '@hookform/devtools'
import { useToast } from '@chakra-ui/react'

import { usePrompt } from '@/utils/form-guard'
import { Playlist } from '@/types/playlist'
import { queryClient } from '@/lib/react-query'

import {
  formValuesToCreateParams,
  formValuesToUpdateParams,
  playlistToDefaultValues
} from '../../utils/form'
import { PlaylistFormInputs } from '../../types'
import { useUpdatePlaylist } from '../../api/updatePlaylist'
import { useCreatePlaylist } from '../../api/createPlaylist'

import { ArrowStepContainer } from './ArrowStepContainer'

const useDispatchFormData = () => {
  const toast = useToast()
  const navigate = useNavigate()

  const { mutateAsync: createPlaylistAsync } = useCreatePlaylist({
    config: {
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
        toast({
          title: '新規作成に失敗しました。',
          status: 'error',
          isClosable: true,
          position: 'top-right'
        })
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['playlists'])
        navigate(`/playlists`)
        toast({
          title: '作成しました。',
          status: 'success',
          isClosable: true,
          position: 'top-right'
        })
      }
    }
  })

  const { mutateAsync: updatePlaylistAsync } = useUpdatePlaylist({
    config: {
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
      }
    }
  })

  return {
    createPlaylistAsync,
    updatePlaylistAsync
  }
}

type Props = {
  playlist?: Playlist | undefined
}

export const PlaylistForm = ({ playlist = undefined }: Props) => {
  const defaultValues = useMemo(
    () => playlistToDefaultValues(playlist),
    [playlist]
  )

  const formMethods = useForm<PlaylistFormInputs>({
    defaultValues,
    mode: 'onChange'
  })

  const { createPlaylistAsync, updatePlaylistAsync } = useDispatchFormData()

  const {
    formState: { isDirty, isSubmitting, dirtyFields },
    handleSubmit,
    control,
    reset
  } = formMethods

  usePrompt(
    '編集中のデータがあります。ページを離れますか？',
    isDirty && !isSubmitting
  )

  const onSubmitForm: SubmitHandler<PlaylistFormInputs> = async (values) => {
    if (playlist?.playlistUid === undefined) {
      const data = formValuesToCreateParams(values, dirtyFields)
      await createPlaylistAsync({ data })
    } else {
      const data = formValuesToUpdateParams(values, dirtyFields)
      await updatePlaylistAsync({
        data,
        playlistUid: playlist.playlistUid
      })
    }
    reset(values)
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmitForm)} data-testid="playlistForm">
        <ArrowStepContainer />
      </form>
      {import.meta.env.MODE === 'development' && <DevTool {...{ control }} />}
    </FormProvider>
  )
}
