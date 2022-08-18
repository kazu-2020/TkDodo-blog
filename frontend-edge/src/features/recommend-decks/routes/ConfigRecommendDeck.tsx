import { useParams } from 'react-router-dom'
import { RiPencilFill } from 'react-icons/all'
import React, { useContext, useEffect } from 'react'
import { Box, Button, Flex, Spacer, Text } from '@chakra-ui/react'

import RecommendDeckConfigForm from '@/features/recommend-decks/components/RecommendDeckConfigForm'
import { useRecommendDeck } from '@/features/recommend-decks/api/getRecommendDeck'
import Link from '@/components/Link'
import { BreadcrumbContext } from '@/components/Breadcrumb'

const ConfigRecommendDeck = () => {
  const breadcrumbDispatch = useContext(BreadcrumbContext).dispatch

  const { recommendDeckId } = useParams()
  const { data, isLoading } = useRecommendDeck(recommendDeckId)

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
        <Text fontSize="xl" fontWeight={500}>
          {data.name}
        </Text>
        <Spacer />
        <Link
          px={0}
          py={0}
          to={`/recommend-decks/${recommendDeckId}`}
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
      <RecommendDeckConfigForm recommendDeck={data} />
    </Box>
  )
}
export default ConfigRecommendDeck
