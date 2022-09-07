import React from 'react'

import { ArrowStepContent } from '@/components/ArrowStep'

import { SearchEpisode } from './SearchEpisode'
import { EditEpisodeList } from './EditEpisodeList'

export const EditListTabContent = ({
  contentIndex
}: {
  contentIndex: number
}) => (
  <ArrowStepContent index={contentIndex}>
    <EditEpisodeList />
    <SearchEpisode />
  </ArrowStepContent>
)
