import React from 'react'
import { Grid, GridItem, Text } from '@chakra-ui/react'

export const PlaylistHeader = () => (
  <Grid
    templateColumns="repeat(13, 1fr)"
    gap={2}
    borderBottom="1px"
    borderColor="gray.200"
    fontSize="xs"
    p={2}
    fontWeight="bold"
    color="gray"
    w="100%"
  >
    <GridItem colSpan={10} h="5" textAlign="left">
      <Text>プレイリスト名</Text>
    </GridItem>
    <GridItem colSpan={1} h="5" textAlign="left">
      <Text>視聴可能</Text>
    </GridItem>
    <GridItem colSpan={1} h="5" />
  </Grid>
)
