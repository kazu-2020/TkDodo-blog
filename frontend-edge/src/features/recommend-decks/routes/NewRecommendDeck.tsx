import React, { useEffect } from 'react'

import { RecommendDeckForm } from '@/features/recommend-decks/components/RecommendDeckForm'

const NewRecommendDeck = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  })

  return <RecommendDeckForm />
}
export default NewRecommendDeck
