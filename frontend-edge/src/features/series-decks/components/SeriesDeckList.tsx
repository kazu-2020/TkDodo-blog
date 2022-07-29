import { useState } from 'react'
import { Stack, useDisclosure } from '@chakra-ui/react'

import { SeriesDeck } from '@/types/series_deck'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'

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
        <ListScreenSkeleton size={20} />
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
