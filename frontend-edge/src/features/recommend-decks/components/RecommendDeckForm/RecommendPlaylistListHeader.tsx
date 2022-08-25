import React from 'react'
import { Grid, GridItem, Text } from '@chakra-ui/react'

export const RecommendPlaylistListHeader = () => (
  <Grid
    templateColumns="repeat(20, 1fr)"
    gap={6}
    borderBottom="1px"
    borderColor="gray.200"
    fontSize="xs"
    fontWeight="bold"
    color="gray"
    p={2}
  >
    <GridItem colSpan={2} h="5" />
    <GridItem colSpan={8} h="5">
      <Text>プレイリスト</Text>
    </GridItem>
    <GridItem colSpan={5} h="5">
      <Text align="center">記事の有無</Text>
    </GridItem>
    <GridItem colSpan={5} h="5">
      <Text align="center">視聴可能エピソード数</Text>
    </GridItem>
  </Grid>
)
