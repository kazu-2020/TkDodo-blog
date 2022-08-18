import React from 'react'

import { ArrowStepContent } from '@/components/ArrowStep'

export const EditArticleTabContent = ({
  contentIndex
}: {
  contentIndex: number
}) => (
  <ArrowStepContent index={contentIndex}>
    <p>記事</p>
  </ArrowStepContent>
)
