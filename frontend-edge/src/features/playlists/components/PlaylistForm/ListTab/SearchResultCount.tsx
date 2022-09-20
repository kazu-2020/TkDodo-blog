import React from 'react'
import { Grid, GridItem, Text } from '@chakra-ui/react'

type Props = {
  count: number
}

export const SearchResultCount = ({ count }: Props) => (
  <Grid
    templateColumns="repeat(1, 1fr)"
    gap={2}
    borderColor="gray.200"
    fontSize="xs"
    fontWeight="bold"
    color="gray"
    p={2}
    w="100%"
  >
    <GridItem h="5" textAlign="left">
      <Text>全{count}件</Text>
    </GridItem>
  </Grid>
)
