import React from 'react'

import { RecommendPlaylistList } from '@/features/recommend-decks/components/RecommendDeckForm/RecommendPlaylistList'
import { EditRecommendPlaylist } from '@/features/recommend-decks/components/RecommendDeckForm/EditRecommendPlaylist'
import { ArrowStepContent } from '@/components/ArrowStep'

export const EditListTabContent = ({
  contentIndex
}: {
  contentIndex: number
}) => (
  <ArrowStepContent index={contentIndex}>
    <EditRecommendPlaylist />
    <RecommendPlaylistList />
  </ArrowStepContent>
)
