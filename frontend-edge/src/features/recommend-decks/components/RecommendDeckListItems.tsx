import { useState } from 'react'
import { Box, Stack, useDisclosure } from '@chakra-ui/react'

import { RecommendDeck } from '@/types/recommend_deck'
import RecommendDeckListItem from '@/features/recommend-decks/components/RecommendDeckListItem'
import { RecommendDeckDrawer } from '@/features/recommend-decks/components/RecommendDeckDrawer/RecommendDeckDrawer'
import { Pagination } from '@/components/Pagination'

type Props = {
  items?: RecommendDeck[]
  page?: number
  totalCount?: number
  onChangePage: (page: number) => void
}

const RecommendDeckListItems = ({
  items = [],
  page = 1,
  totalCount = 0,
  onChangePage = () => {}
}: Props) => {
  const [selectedRecommendDeck, setSelectedRecommendDeck] = useState<
    RecommendDeck | undefined
  >(undefined)
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Stack data-testid="recommend-list-items">
      {totalCount > 0 && (
        <Box pt={10} pb={3}>
          <Pagination
            page={page}
            totalCount={totalCount}
            onChangePage={onChangePage}
          />
        </Box>
      )}

      {items?.map((recommendDeck: RecommendDeck) => (
        <RecommendDeckListItem
          key={recommendDeck.stringId}
          recommendDeck={recommendDeck}
          setSelectedRecommendDeck={setSelectedRecommendDeck}
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

      {selectedRecommendDeck && (
        <RecommendDeckDrawer
          recommendDeck={selectedRecommendDeck}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </Stack>
  )
}

export default RecommendDeckListItems
