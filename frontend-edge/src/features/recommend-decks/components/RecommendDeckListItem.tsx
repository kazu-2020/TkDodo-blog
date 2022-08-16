import { Flex, HStack, Text } from '@chakra-ui/react'

import { RecommendDeck } from '@/types/recommend_deck'
import ApiStateBadge from '@/components/ApiStateBadge'

const RecommendDeckListItem = ({
  recommendDeck,
  setSelectedRecommendDeck,
  onOpen
}: {
  recommendDeck: RecommendDeck
  setSelectedRecommendDeck: any
  onOpen: any
}) => {
  const handleClick = () => {
    setSelectedRecommendDeck(recommendDeck)
    onOpen()
  }

  return (
    <Flex
      key={recommendDeck.stringId}
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
          {recommendDeck.name}
        </Text>
        <ApiStateBadge apiState={recommendDeck.apiState} />
      </HStack>
    </Flex>
  )
}
export default RecommendDeckListItem
