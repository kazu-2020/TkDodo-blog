import React from 'react'
import { Heading } from '@chakra-ui/react'

import RecommendDeckList from '../components/RecommendDeckList'

const RecommendDecks = () => (
  <>
    <Heading as="h2" size="md" mb={5}>
      レコメンドデッキ一覧
    </Heading>
    <RecommendDeckList />
  </>
)
export default RecommendDecks
