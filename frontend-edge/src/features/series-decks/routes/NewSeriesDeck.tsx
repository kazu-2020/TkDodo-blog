import React, { useEffect } from 'react'
import { Box } from '@chakra-ui/react'

import SeriesDeckForm from '@/features/series-decks/components/SeriesDeckForm'

const NewSeriesDeck = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  })

  return (
    <Box bg="white" p={5} borderRadius="sm">
      <SeriesDeckForm />
    </Box>
  )
}
export default NewSeriesDeck
