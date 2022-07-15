import { useParams } from 'react-router-dom'
import React, { useEffect } from 'react'
import { Box } from '@chakra-ui/react'

import SeriesDeckForm from '@/features/series-decks/components/SeriesDeckForm'

import { useSeriesDeck } from '../api/getSeriesDeck'

const SeriesDeck = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  })

  const { seriesDeckId } = useParams()
  const { data, isLoading } = useSeriesDeck(seriesDeckId)

  if (!data) return null

  if (isLoading) {
    return (
      <main style={{ padding: '1rem' }}>
        <span>Loading...</span>
      </main>
    )
  }

  return (
    <Box bg="white" p={5} borderRadius="sm">
      <SeriesDeckForm deck={data} />
    </Box>
  )
}
export default SeriesDeck
