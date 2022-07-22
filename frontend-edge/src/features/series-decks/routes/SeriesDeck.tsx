import { useParams } from 'react-router-dom'
import { MdSettings } from 'react-icons/all'
import React, { useContext, useEffect } from 'react'
import { Box, Button, Text, Flex, Spacer } from '@chakra-ui/react'

import SeriesDeckForm from '@/features/series-decks/components/SeriesDeckForm'
import Link from '@/components/Link'
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
          leftIcon={<MdSettings />}
        >
          <Link
            px={0}
            py={0}
            to={`/series-decks/${seriesDeckId}/config`}
            _hover={{ textDecoration: 'none' }}
          >
            <Text>管理設定</Text>
          </Link>
        </Button>
      </Flex>

      <Box bg="white" p={5} borderRadius="sm">
        <SeriesDeckForm deck={data} />
      </Box>
    </>
  )
}
export default SeriesDeck
