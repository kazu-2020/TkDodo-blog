import { useParams } from 'react-router-dom'
import React, { useContext, useEffect } from 'react'
import { Box } from '@chakra-ui/react'

import SeriesDeckForm from '@/features/series-decks/components/SeriesDeckForm'
import { BreadcrumbContext } from '@/components/Breadcrumb/BreadcrumbContext'

import { useUpdateSeriesDeck } from '../api/updateSeriesDeck'
import { useSeriesDeck } from '../api/getSeriesDeck'

const SeriesDeck = () => {
  const breadcrumbDispatch = useContext(BreadcrumbContext).dispatch

  const { seriesDeckId } = useParams()
  const { data, isLoading } = useSeriesDeck(seriesDeckId)
  const updateSeriesDeckMutation = useUpdateSeriesDeck()

  useEffect(() => {
    window.scrollTo(0, 0)

    breadcrumbDispatch({ name: data?.name ?? '' })
  }, [breadcrumbDispatch, data])

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
      <SeriesDeckForm mutation={updateSeriesDeckMutation} deck={data} />
    </Box>
  )
}
export default SeriesDeck
