import { useFormContext } from 'react-hook-form'
import React from 'react'

import { PlaylistFormInputs } from '@/features/playlists/types'
import { SearchForm } from '@/features/playlists/components/PlaylistForm/ListTab/SearchForm'
import { ArrowStepContent } from '@/components/ArrowStep'

import { EditEpisodeList } from './EditEpisodeList'

export const EditListTabContent = ({
  contentIndex
}: {
  contentIndex: number
}) => {
  const { register } = useFormContext<PlaylistFormInputs>()

  return (
    <ArrowStepContent index={contentIndex}>
      <input type="hidden" {...register('episodes')} />
      <EditEpisodeList />
      <SearchForm />
    </ArrowStepContent>
  )
}
