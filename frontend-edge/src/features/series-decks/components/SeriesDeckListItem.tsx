import { Flex, HStack, Text } from '@chakra-ui/react'

import { Deck as SeriesDeck } from '@/types/deck'
import ApiStateBadge from '@/components/ApiStateBadge'

const SeriesDeckListItem = ({
  seriesDeck,
  setSelectedSeriesDeck,
  onOpen
}: {
  seriesDeck: SeriesDeck
  setSelectedSeriesDeck: any
  onOpen: any
}) => {
  const handleClick = () => {
    setSelectedSeriesDeck(seriesDeck)
    onOpen()
  }

  return (
    <Flex
      key={seriesDeck.id}
      h="48px"
      px={3}
      bg="white"
      boxShadow="sm"
      justifyContent="space-between"
      cursor="pointer"
      onClick={() => handleClick()}
      role="listitem"
    >
      <HStack>
        <Text color="primary" fontWeight="700">
          {seriesDeck.name}
        </Text>
        <ApiStateBadge apiState={seriesDeck.apiState} />
      </HStack>
    </Flex>
  )
}
export default SeriesDeckListItem
