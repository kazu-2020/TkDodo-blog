import React from 'react'
import { Center, Grid, GridItem, Text } from '@chakra-ui/react'

export const EpisodeHeader = () => (
  <Grid
    templateColumns="repeat(36, 1fr)"
    gap={2}
    borderBottom="1px"
    borderColor="gray.200"
    fontSize="xs"
    fontWeight="bold"
    color="gray"
    p={2}
    w="100%"
  >
    <GridItem h="5" colSpan={3} />
    <GridItem colSpan={9} h="5" textAlign="left">
      <Text>エピソード</Text>
    </GridItem>
    <GridItem colSpan={5} h="5">
      <Center h="100%">
        <Text>再生時間</Text>
      </Center>
    </GridItem>
    <GridItem colSpan={8} h="5" textAlign="left">
      <Text>シリーズ名</Text>
    </GridItem>
    <GridItem colSpan={6} h="5">
      <Center h="100%">
        <Text>直近放送日</Text>
      </Center>
    </GridItem>
    <GridItem colSpan={5} h="5">
      <Center h="100%">
        <Text>視聴可能</Text>
      </Center>
    </GridItem>
  </Grid>
)
