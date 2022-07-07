import React from 'react'
import { Heading } from '@chakra-ui/react'

import SeriesDeckList from '../components/SeriesDeckList'

const SeriesDecks = () => (
  <>
    <Heading as="h2" size="md" mb={5}>
      シリーズデッキ一覧
    </Heading>
    <SeriesDeckList />
  </>
)
export default SeriesDecks
