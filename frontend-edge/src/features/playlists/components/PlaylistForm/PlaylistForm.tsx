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

type Props = {
  playlist?: Playlist | undefined
}

export const PlaylistForm = ({ playlist = undefined }: Props) => {
  const formMethods = useForm<PlaylistFormInputs>({
    defaultValues: playlistToDefaultValues(playlist),
    mode: 'onChange'
  })

  const toast = useToast({
    isClosable: true,
    position: 'top-right'
  })

  const { mutateAsync: createPlaylistAsync } = useCreatePlaylist()
  const { mutateAsync: updatePlaylistAsync } = useUpdatePlaylist()

  const {
    formState: { isDirty, isSubmitting, dirtyFields },
    handleSubmit,
    control,
    reset
  } = formMethods

  const createPlaylist = async (inputData: PlaylistFormInputs) => {
    try {
      const data = formValuesToCreateParams(inputData, dirtyFields)
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
    inputData: PlaylistFormInputs,
    playlistUid: string
  ) => {
    try {
      const data = formValuesToUpdateParams(inputData, dirtyFields)
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

  const onSubmitForm: SubmitHandler<PlaylistFormInputs> = (values) => {
    if (playlist?.playlistUid === undefined) {
      createPlaylist(values)
    } else {
      updatePlaylist(values, playlist.playlistUid)
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
