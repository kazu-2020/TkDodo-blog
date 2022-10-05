import React from 'react'
import { Grid, GridItem, Text } from '@chakra-ui/react'

export const SearchResultHeader = ({
  searchResultCount
}: {
  searchResultCount: number
}) => (
  <>
    <Text>全{searchResultCount}件</Text>
    {/* ヘッダー */}
    <Grid
      templateColumns="repeat(10, 1fr)"
      gap={6}
      borderBottom="1px"
      borderColor="gray.200"
      fontSize="xs"
      fontWeight="bold"
      color="gray"
      p={2}
    >
      <GridItem h="5" />
      <GridItem colSpan={9} h="5">
        <Text>シリーズ</Text>
      </GridItem>
    </Grid>
  </>
)
