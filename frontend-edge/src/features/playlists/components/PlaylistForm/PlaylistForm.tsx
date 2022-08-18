import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import React, { useEffect } from 'react'

import { Playlist } from '@/types/playlist'
import { usePlaylistFormStore } from '@/features/playlists/stores/playlistForm'

import { PlaylistFormInputs } from '../../types'
import { useUpdatePlaylist } from '../../api/updatePlaylist'
import { useCreatePlaylist } from '../../api/createPlaylist'

import { ArrowStepContainer } from './ArrowStepContainer'

const useSeriesForm = (playlist: Playlist | undefined) =>
  useForm<PlaylistFormInputs>({
    defaultValues: {
      name: playlist?.name,
      description: playlist?.description,
      apiState: playlist?.apiState === 'open'
    },
    mode: 'onChange'
  })

type Props = {
  playlist?: Playlist | undefined
}

export const PlaylistForm = ({ playlist = undefined }: Props) => {
  const formMethods = useSeriesForm(playlist)
  const { getValues, handleSubmit, trigger, reset } = formMethods

  const {
    setInputValues,
    episodes,
    setEpisodes,
    hasChangedEpisodes,
    resetHasChangedEpisodes
  } = usePlaylistFormStore((state) => ({
    setInputValues: state.setInputValues,
    episodes: state.episodes,
    setEpisodes: state.setEpisodes,
    hasChangedEpisodes: state.hasChangedEpisodes,
    resetHasChangedEpisodes: state.resetHasChangedEpisodes
  }))

  useEffect(() => {
    setEpisodes(playlist?.items || [])
    setInputValues(getValues())
    trigger()
  }, [playlist, setEpisodes, setInputValues, getValues, trigger])

  const createPlaylistMutation = useCreatePlaylist()
  const updatePlaylistMutation = useUpdatePlaylist()

  const onSubmit: SubmitHandler<PlaylistFormInputs> = async (values) => {
    const episodeIds = episodes.map((episode) => episode.episodeId)

    if (playlist?.id === undefined) {
      await createPlaylistMutation.mutateAsync({
        data: { ...values, items: episodeIds }
      })
    } else {
      await updatePlaylistMutation.mutateAsync({
        data: {
          ...values,
          items: episodeIds,
          enableListUpdate: hasChangedEpisodes
        },
        playlistId: playlist.id
      })
    }
    resetHasChangedEpisodes()
    reset(values)
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} data-testid="playlistForm">
        <ArrowStepContainer />
      </form>
    </FormProvider>
  )
}
