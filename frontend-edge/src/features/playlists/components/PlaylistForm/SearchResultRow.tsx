import { HiOutlinePlus } from 'react-icons/all'
import React from 'react'
import { Button, Grid, GridItem, HStack, Image, Text } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/icons'

export const SearchResultRow = ({
  onClick,
  playlist
}: {
  onClick: () => void
  playlist: any
}) => (
  <Grid
    templateColumns="repeat(12, 1fr)"
    gap={6}
    fontSize="sm"
    py={3}
    borderBottom="1px"
    borderColor="gray.200"
  >
    <GridItem h="8">
      <Button
        aria-label="追加"
        boxShadow="md"
        h="8"
        w="8"
        minW="8"
        colorScheme="orange"
        bg="accent"
        color="black"
        borderRadius="sm"
        onClick={onClick}
      >
        <Icon as={HiOutlinePlus} />
      </Button>
    </GridItem>
    <GridItem colSpan={11} h="8">
      <HStack>
        <Image
          src={
            playlist.logo?.medium?.url ??
            '/public/dummy/default1/default1-logo.png'
          }
          alt="EditorialHands"
          h="32px"
          boxShadow="md"
          mr={1}
        />
        <Text>{playlist.name}</Text>
      </HStack>
    </GridItem>
  </Grid>
)
