import React from 'react'

import { SearchSeriesPlaylist } from '@/features/series-decks/components/SeriesDeckForm/SearchSeriesPlaylist'
import { EditSeriesPlaylist } from '@/features/series-decks/components/SeriesDeckForm/EditSeriesPlaylist'
import { ArrowStepContent } from '@/components/ArrowStep'

export const EditListTabContent = ({
  contentIndex
}: {
  contentIndex: number
}) => (
  <ArrowStepContent index={contentIndex}>
    <EditSeriesPlaylist />
    <SearchSeriesPlaylist />
  </ArrowStepContent>
)
