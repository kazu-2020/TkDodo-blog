import React from 'react'
import { Box, Grid, GridItem, HStack, Image, Text } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'

export const SeriesHeader = () => (
  <Grid
    templateColumns="repeat(13, 1fr)"
    gap={2}
    borderBottom="1px"
    borderColor="gray.200"
    fontSize="xs"
    fontWeight="bold"
    color="gray"
    p={2}
    w="100%"
  >
    <GridItem colSpan={10} h="5" textAlign="left">
      <Text>シリーズ名</Text>
    </GridItem>
    <GridItem colSpan={1} h="5" textAlign="left">
      <Text>視聴可能</Text>
    </GridItem>
    <GridItem colSpan={1} h="5" />
  </Grid>
)
