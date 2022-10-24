import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import React from 'react'
import { DevTool } from '@hookform/devtools'

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
    formState: { dirtyFields }
  } = formMethods

  const createPlaylistMutation = useCreatePlaylist()
  const updatePlaylistMutation = useUpdatePlaylist()

  const onSubmit: SubmitHandler<PlaylistFormInputs> = async (values) => {
    if (playlist?.playlistUId === undefined) {
      const data = formValuesToCreateParams(values, dirtyFields)

      await createPlaylistMutation.mutateAsync({ data })
    } else {
      const data = formValuesToUpdateParams(values, dirtyFields)
      await updatePlaylistMutation.mutateAsync({
        data,
        playlistUId: playlist.playlistUId
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
