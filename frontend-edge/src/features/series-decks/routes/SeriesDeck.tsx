import { useParams } from 'react-router-dom'
import React, { useContext, useEffect } from 'react'
import { Skeleton, HStack } from '@chakra-ui/react'

import { SeriesDeckForm } from '@/features/series-decks/components/SeriesDeckForm'
import { BreadcrumbContext } from '@/components/Breadcrumb'

import { useSeriesDeck } from '../api/getSeriesDeck'

const SeriesDeck = () => {
  const breadcrumbDispatch = useContext(BreadcrumbContext).dispatch

  const { seriesDeckId } = useParams()
  const { data, isLoading } = useSeriesDeck(seriesDeckId)

  useEffect(() => {
    window.scrollTo(0, 0)

    breadcrumbDispatch({ name: data?.name ?? '' })
  }, [breadcrumbDispatch, data])

  if (isLoading) {
    return (
      <>
        <HStack spacing="4" alignItems="start" mb={5}>
          <Skeleton p={5} borderRadius="sm" minH="60px" flex={1} />
          <Skeleton h="60px" w="300px" px={3} bg="white" borderRadius="md" />
        </HStack>
        <HStack spacing="4" alignItems="start">
          <Skeleton p={5} borderRadius="sm" minH="400px" flex={1} />
          <Skeleton h="400px" w="300px" px={3} bg="white" borderRadius="md" />
        </HStack>
      </>
    )
  }

  if (!data) return null

  return <SeriesDeckForm seriesDeck={data} />
}
export default SeriesDeck
