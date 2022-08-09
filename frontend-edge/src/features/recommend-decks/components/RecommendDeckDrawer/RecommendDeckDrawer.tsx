import { Drawer, DrawerBody, DrawerContent, Text } from '@chakra-ui/react'

import { SeriesDeck } from '@/types/series_deck'

export const RecommendDeckDrawer = ({
  recommendDeck,
  isOpen,
  onClose
}: {
  recommendDeck: SeriesDeck
  isOpen: any
  onClose: any
}) => (
  <Drawer
    isOpen={isOpen}
    onClose={onClose}
    size="md"
    blockScrollOnMount={false}
  >
    <DrawerContent>
      <DrawerBody p={0}>
        <Text>{recommendDeck.name}</Text>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
)
