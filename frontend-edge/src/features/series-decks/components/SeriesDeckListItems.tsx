import { useState } from 'react'
import { Box, Stack, useDisclosure } from '@chakra-ui/react'

import { SeriesDeck } from '@/types/series_deck'
import SeriesDeckListItem from '@/features/series-decks/components/SeriesDeckListItem'
import SeriesDeckDrawer from '@/features/series-decks/components/SeriesDeckDrawer'
import { Pagination } from '@/components/Pagination'

type Props = {
  items?: SeriesDeck[]
  page?: number
  totalCount?: number
  onChangePage: (page: number) => void
}

const SeriesDeckListItems = ({
  items = [],
  page = 1,
  totalCount = 0,
  onChangePage = () => {}
}: Props) => {
  const [selectedSeriesDeck, setSelectedSeriesDeck] = useState<
    SeriesDeck | undefined
  >(undefined)
  const { isOpen, onOpen, onClose } = useDisclosure()

  console.log(items)

  return (
    <Stack>
      {totalCount > 0 && (
        <Box pt={10} pb={3}>
          <Pagination
            page={page}
            totalCount={totalCount}
            onChangePage={onChangePage}
          />
        </Box>
      )}

      {items?.map((seriesDeck: SeriesDeck) => (
        <SeriesDeckListItem
          key={seriesDeck.stringId}
          seriesDeck={seriesDeck}
          setSelectedSeriesDeck={setSelectedSeriesDeck}
          onOpen={onOpen}
        />
      ))}

      {totalCount > 0 && (
        <Box pt={3} pb={10}>
          <Pagination
            page={page}
            totalCount={totalCount}
            onChangePage={onChangePage}
          />
        </Box>
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

export default SeriesDeckListItems
