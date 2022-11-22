import { QueryClientProvider } from 'react-query'
import { FormProvider, useForm } from 'react-hook-form'
import React from 'react'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import { Playlist } from '@/types/playlist'
import { handlers } from '@/test/server/handlers'
import { playlistGenerator } from '@/test/data-generators'
import { queryClient } from '@/lib/react-query'
import { playlistToDefaultValues } from '@/features/playlists/utils/form'
import { PlaylistFormInputs } from '@/features/playlists/types'

import { ActiveCheckboxes } from './ActiveCheckboxes'

export default {
  component: ActiveCheckboxes
} as ComponentMeta<typeof ActiveCheckboxes>

const fakePlaylist = playlistGenerator()

const usePlaylistForm = (playlist: Playlist | undefined) => {
  const defaultValues = playlistToDefaultValues(playlist)

  return useForm<PlaylistFormInputs>({
    defaultValues,
    mode: 'onChange'
  })
}

export const Default: ComponentStoryObj<typeof ActiveCheckboxes> = {
  render: () => {
    const formMethods = usePlaylistForm(fakePlaylist)

    return (
      <QueryClientProvider client={queryClient}>
        <FormProvider {...formMethods}>
          <ActiveCheckboxes />
        </FormProvider>
      </QueryClientProvider>
    )
  },
  parameters: {
    msw: {
      handlers
    },
    reactRouter: {
      routePath: '/playlists/:playlistUId',
      routeParams: { playlistUId: fakePlaylist.playlistUId }
    }
  }
}
