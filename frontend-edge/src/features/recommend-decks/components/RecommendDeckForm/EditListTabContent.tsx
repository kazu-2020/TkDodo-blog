import React from 'react'

import { SearchRecommendPlaylist } from '@/features/recommend-decks/components/RecommendDeckForm/SearchRecommendPlaylist'
import { EditRecommendPlaylist } from '@/features/recommend-decks/components/RecommendDeckForm/EditRecommendPlaylist'
import { ArrowStepContent } from '@/components/ArrowStep'

export const EditListTabContent = ({
  contentIndex
}: {
  contentIndex: number
}) => (
  <ArrowStepContent index={contentIndex}>
    <EditRecommendPlaylist />
    <SearchRecommendPlaylist />
  </ArrowStepContent>
)
