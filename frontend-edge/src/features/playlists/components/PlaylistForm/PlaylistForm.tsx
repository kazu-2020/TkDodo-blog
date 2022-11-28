import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import React from 'react'
import { DevTool } from '@hookform/devtools'

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

const usePlaylistForm = (playlist: Playlist | undefined) => {
  const defaultValues = playlistToDefaultValues(playlist)

  return useForm<PlaylistFormInputs>({
    defaultValues,
    mode: 'onChange'
  })
}

type Props = {
  playlist?: Playlist | undefined
}

export const PlaylistForm = ({ playlist = undefined }: Props) => {
  const formMethods = usePlaylistForm(playlist)
  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields, isDirty, isSubmitting }
  } = formMethods

  usePrompt(
    '編集中のデータがあります。ページを離れますか？',
    isDirty && !isSubmitting
  )

  const createPlaylistMutation = useCreatePlaylist()
  const updatePlaylistMutation = useUpdatePlaylist()

  const onSubmit: SubmitHandler<PlaylistFormInputs> = async (values) => {
    if (playlist?.playlistUid === undefined) {
      const data = formValuesToCreateParams(values, dirtyFields)

      await createPlaylistMutation.mutateAsync({ data })
    } else {
      const data = formValuesToUpdateParams(values, dirtyFields)
      await updatePlaylistMutation.mutateAsync({
        data,
        playlistUid: playlist.playlistUid
      })
    }
    reset(values)
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} data-testid="playlistForm">
        <ArrowStepContainer />
      </form>
      {import.meta.env.MODE === 'development' && <DevTool control={control} />}
    </FormProvider>
  )
}
