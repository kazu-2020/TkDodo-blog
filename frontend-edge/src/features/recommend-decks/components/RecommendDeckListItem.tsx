import { Center, Grid, GridItem, HStack, Text } from '@chakra-ui/react'

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
    <Grid
      data-testid="recommend-deck-list-item"
      key={recommendDeck.stringId}
      h="48px"
      px={3}
      bg="white"
      boxShadow="sm"
      cursor="pointer"
      onClick={() => handleClick()}
      role="listitem"
      templateColumns="repeat(12, 1fr)"
    >
      <GridItem colSpan={4}>
        <HStack h="100%" alignItems="center">
          <Text color="primary" fontWeight="700" noOfLines={1}>
            {recommendDeck.name}
          </Text>
        </HStack>
      </GridItem>
      <GridItem colSpan={2}>
        <Center h="100%">
          <ApiStateBadge apiState={recommendDeck.apiState} />
        </Center>
      </GridItem>
      <GridItem colSpan={6}>
        <HStack h="100%" alignItems="center">
          <Text noOfLines={1}>{recommendDeck.adminMemo}</Text>
        </HStack>
      </GridItem>
    </Grid>
  )
}
export default RecommendDeckListItem
