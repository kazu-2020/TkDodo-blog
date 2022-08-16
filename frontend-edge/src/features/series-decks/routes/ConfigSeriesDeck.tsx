import { useParams } from 'react-router-dom'
import { RiPencilFill } from 'react-icons/all'
import React, { useContext, useEffect } from 'react'
import { Box, Button, Flex, Spacer, Text } from '@chakra-ui/react'

import SeriesDeckConfigForm from '@/features/series-decks/components/SeriesDeckConfigForm'
import { useSeriesDeck } from '@/features/series-decks/api/getSeriesDeck'
import Link from '@/components/Link'
import { BreadcrumbContext } from '@/components/Breadcrumb'

const ConfigSeriesDeck = () => {
  const breadcrumbDispatch = useContext(BreadcrumbContext).dispatch

  const { seriesDeckId } = useParams()
  const { data, isLoading } = useSeriesDeck(seriesDeckId)

  useEffect(() => {
    window.scrollTo(0, 0)

    if (typeof breadcrumbDispatch === 'function') {
      breadcrumbDispatch({ name: data?.name ?? '' })
    }
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
      <Flex mb={5}>
        <Spacer />
        <Link
          px={0}
          py={0}
          to={`/series-decks/${seriesDeckId}`}
          _hover={{ textDecoration: 'none' }}
        >
          <Button
            type="submit"
            form="my-form"
            colorScheme="blackAlpha"
            leftIcon={<RiPencilFill />}
          >
            <Text>デッキ編集</Text>
          </Button>
        </Link>
      </Flex>
      <SeriesDeckConfigForm seriesDeck={data} />
    </Box>
  )
}
export default ConfigSeriesDeck
