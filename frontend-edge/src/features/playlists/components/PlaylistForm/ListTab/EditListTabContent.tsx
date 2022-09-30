import React from 'react'

import { Playlist } from '@/types/playlist'
import { SearchForm } from '@/features/playlists/components/PlaylistForm/ListTab/SearchForm'
import { ArrowStepContent } from '@/components/ArrowStep'

import { EditEpisodeList } from './EditEpisodeList'

export const EditListTabContent = ({
  contentIndex,
  playlist
}: {
  contentIndex: number
  playlist?: Playlist
}) => (
  <ArrowStepContent index={contentIndex}>
    <EditEpisodeList playlist={playlist} />
    <SearchForm playlist={playlist} />
  </ArrowStepContent>
)
