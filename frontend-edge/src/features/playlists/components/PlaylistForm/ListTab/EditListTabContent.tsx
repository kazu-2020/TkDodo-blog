import React from 'react'

import { SearchForm } from '@/features/playlists/components/PlaylistForm/ListTab/SearchForm'
import { ArrowStepContent } from '@/components/ArrowStep'

import { EditEpisodeList } from './EditEpisodeList'

export const EditListTabContent = ({
  contentIndex
}: {
  contentIndex: number
}) => (
  <ArrowStepContent index={contentIndex}>
    <EditEpisodeList />
    <SearchForm />
  </ArrowStepContent>
)
