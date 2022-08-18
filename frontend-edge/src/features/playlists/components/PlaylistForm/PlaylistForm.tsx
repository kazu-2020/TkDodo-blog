import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import React, { useEffect } from 'react'

import { Playlist } from '@/types/playlist'
import { playlistToDefaultValues } from '@/features/playlists/utils/formMapper'
import { usePlaylistFormStore } from '@/features/playlists/stores/playlistForm'

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
  const { getValues, handleSubmit, trigger, reset } = formMethods

  const {
    inputValues,
    setInputValues,
    episodes,
    setEpisodes,
    hasChangedEpisodes,
    resetHasChangedEpisodes,
    article,
    setArticle,
    clearStore
  } = usePlaylistFormStore((state) => ({
    inputValues: state.inputValues,
    setInputValues: state.setInputValues,
    episodes: state.episodes,
    setEpisodes: state.setEpisodes,
    hasChangedEpisodes: state.hasChangedEpisodes,
    resetHasChangedEpisodes: state.resetHasChangedEpisodes,
    article: state.article,
    setArticle: state.setArticle,
    clearStore: state.clearStore
  }))

  useEffect(() => {
    setEpisodes(playlist?.items || [])
    setArticle(playlist?.article || {})
    setInputValues(getValues())
    trigger()
    return () => {
      clearStore()
    }
  }, [])

  useEffect(() => {
    trigger()
  }, [inputValues, episodes, article, trigger])

  const createPlaylistMutation = useCreatePlaylist()
  const updatePlaylistMutation = useUpdatePlaylist()

  const onSubmit: SubmitHandler<PlaylistFormInputs> = async (values) => {
    const episodeIds = episodes.map((episode) => episode.id)

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
