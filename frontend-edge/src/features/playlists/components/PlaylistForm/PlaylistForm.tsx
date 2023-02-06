import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { useToast } from '@chakra-ui/react'

import { usePrompt } from '@/utils/form-guard'
import { Playlist } from '@/types/playlist'

import {
  formValuesToCreateParams,
  formValuesToUpdateParams,
  playlistToDefaultValues
} from '../../utils/form'
import { PlaylistFormInputs } from '../../types'
import { useUpdatePlaylist } from '../../api/updatePlaylist'
import { useCreatePlaylist } from '../../api/createPlaylist'

import { ArrowStepContainer } from './ArrowStepContainer'

type PlaylistProps = {
  playlist?: Playlist
}

const useDispatchFormData = () => {
  const toast = useToast({
    isClosable: true,
    position: 'top-right'
  })

  const { mutateAsync: createPlaylistAsync } = useCreatePlaylist()
  const { mutateAsync: updatePlaylistAsync } = useUpdatePlaylist()

  const createPlaylist = async (
    data: ReturnType<typeof formValuesToCreateParams>
  ) => {
    try {
      await createPlaylistAsync({ data })
      toast({
        title: '作成しました。',
        status: 'success'
      })
    } catch {
      toast({
        title: '新規作成に失敗しました。',
        status: 'error'
      })
    }
  }

  const updatePlaylist = async (
    playlistUid: string,
    data: ReturnType<typeof formValuesToUpdateParams>
  ) => {
    try {
      await updatePlaylistAsync({
        data,
        playlistUid
      })
      toast({
        title: '保存しました。',
        status: 'success'
      })
    } catch {
      toast({
        title: '保存に失敗しました。',
        status: 'error'
      })
    }
  }

  return {
    createPlaylist,
    updatePlaylist
  }
}

export const PlaylistForm = ({ playlist = undefined }: PlaylistProps) => {
  const formMethods = useForm<PlaylistFormInputs>({
    defaultValues: playlistToDefaultValues(playlist),
    mode: 'onChange'
  })

  const {
    formState: { isDirty, isSubmitting, dirtyFields },
    handleSubmit,
    control,
    reset
  } = formMethods

  const { createPlaylist, updatePlaylist } = useDispatchFormData()

  const onSubmitForm: SubmitHandler<PlaylistFormInputs> = (values) => {
    const data = formValuesToCreateParams(values, dirtyFields)
    if (playlist?.playlistUid === undefined) {
      createPlaylist(data)
    } else {
      updatePlaylist(playlist.playlistUid, data)
    }
    reset(values)
  }

  usePrompt(
    '編集中のデータがあります。ページを離れますか？',
    isDirty && !isSubmitting
  )

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmitForm)} data-testid="playlistForm">
        <ArrowStepContainer />
      </form>
      {import.meta.env.MODE === 'development' && <DevTool {...{ control }} />}
    </FormProvider>
  )
}
