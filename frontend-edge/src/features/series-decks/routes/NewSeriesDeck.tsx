import React, { useEffect } from 'react'

import { SeriesDeckForm } from '@/features/series-decks/components/SeriesDeckForm'

const NewSeriesDeck = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  })

  return <SeriesDeckForm />
}
export default NewSeriesDeck
