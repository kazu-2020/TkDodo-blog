import { useParams } from 'react-router-dom'
import { RiPencilFill } from 'react-icons/all'
import React, { useContext, useEffect } from 'react'
import { Box, Button, Flex, Spacer, Text } from '@chakra-ui/react'

import SeriesDeckConfigForm from '@/features/series-decks/components/SeriesDeckConfigForm'
import { useSeriesDeck } from '@/features/series-decks/api/getSeriesDeck'
import { BreadcrumbContext } from '@/features/misc/components/breadcrumb/BreadcrumbContext'
import Link from '@/components/Link'

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
    <>
      <Flex mb={5}>
        <Spacer />
        <Button
          type="submit"
          form="my-form"
          colorScheme="blackAlpha"
          leftIcon={<RiPencilFill />}
        >
          <Link
            px={0}
            py={0}
            to={`/series-decks/${seriesDeckId}`}
            _hover={{ textDecoration: 'none' }}
          >
            <Text>デッキ編集</Text>
          </Link>
        </Button>
      </Flex>

      <Box bg="white" p={5} borderRadius="sm">
        <SeriesDeckConfigForm deck={data} />
      </Box>
    </>
  )
}
export default ConfigSeriesDeck
