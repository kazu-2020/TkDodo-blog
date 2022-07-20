import { useParams } from 'react-router-dom'
import React, { useContext, useEffect } from 'react'
import { Box } from '@chakra-ui/react'

import SeriesDeckConfigForm from '@/features/series-decks/components/SeriesDeckConfigForm'
import { useSeriesDeck } from '@/features/series-decks/api/getSeriesDeck'
import { BreadcrumbContext } from '@/features/misc/components/breadcrumb/BreadcrumbContext'

const ConfigSeriesDeck = () => {
  const breadcrumbDispatch = useContext(BreadcrumbContext).dispatch

  const { seriesDeckId } = useParams()
  const { data, isLoading } = useSeriesDeck(seriesDeckId)

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
      <SeriesDeckConfigForm deck={data} />
    </Box>
  )
}
export default ConfigSeriesDeck
