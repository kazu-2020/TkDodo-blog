import { useState } from 'react'
import { nanoid } from 'nanoid'
import { Skeleton, Stack, useDisclosure } from '@chakra-ui/react'

import { Deck as SeriesDeck } from '@/types/deck'

import { useSeriesDecks } from '../api/getSeriesDecks'

import SeriesDeckListItem from './SeriesDeckListItem'
import SeriesDeckDrawer from './SeriesDeckDrawer'

const SeriesDeckList = () => {
  const { data, isLoading } = useSeriesDecks()
  const [selectedSeriesDeck, setSelectedSeriesDeck] = useState<
    SeriesDeck | undefined
  >(undefined)
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (isLoading) {
    return (
      <Stack>
        {[...Array(20)].map(() => (
          <Skeleton
            data-testid="skeleton"
            key={nanoid()}
            h="48px"
            px={3}
            bg="white"
            borderRadius="md"
          />
        ))}
      </Stack>
    )
  }

  if (data === undefined || data.length < 1) {
    return <p>シリーズデッキはありません。</p>
  }

  return (
    <Stack role="list">
      {data?.map((seriesDeck: SeriesDeck) =>
        SeriesDeckListItem({ seriesDeck, setSelectedSeriesDeck, onOpen })
      )}
      {selectedSeriesDeck && (
        <SeriesDeckDrawer
          seriesDeck={selectedSeriesDeck}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </Stack>
  )
}
export default SeriesDeckList
