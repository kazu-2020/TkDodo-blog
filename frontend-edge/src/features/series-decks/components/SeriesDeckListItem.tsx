import { Center, Grid, GridItem, HStack, Text } from '@chakra-ui/react'

import { SeriesDeck } from '@/types/series_deck'
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
    <Grid
      key={seriesDeck.stringId}
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
            {seriesDeck.name}
          </Text>
        </HStack>
      </GridItem>
      <GridItem colSpan={2}>
        <Center h="100%">
          <ApiStateBadge apiState={seriesDeck.apiState} />
        </Center>
      </GridItem>
      <GridItem colSpan={6}>
        <HStack h="100%" alignItems="center">
          <Text noOfLines={1}>{seriesDeck.adminMemo}</Text>
        </HStack>
      </GridItem>
    </Grid>
  )
}
export default SeriesDeckListItem
