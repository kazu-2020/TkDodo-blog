import React, { useEffect } from 'react'
import { Box } from '@chakra-ui/react'

import SeriesDeckNewForm from '@/features/series-decks/components/SeriesDeckNewForm'

import { useCreateSeriesDeck } from '../api/createSeriesDeck'

const NewSeriesDeck = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  })

  const createSeriesDeckMutation = useCreateSeriesDeck()

  return (
    <Box bg="white" p={5} borderRadius="sm">
      <SeriesDeckNewForm mutation={createSeriesDeckMutation} />
    </Box>
  )
}
export default NewSeriesDeck
