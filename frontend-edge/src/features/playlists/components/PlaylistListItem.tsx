import { MdMonitor, MdUpdate } from 'react-icons/md'
import {
  Center,
  Grid,
  GridItem,
  HStack,
  Icon,
  Image,
  Text
} from '@chakra-ui/react'

import { formatDatetime } from '@/utils/format'
import { Playlist } from '@/types/playlist'
import ApiStateBadge from '@/components/ApiStateBadge'

export const PlaylistListItem = ({
  playlist,
  onClick
}: {
  playlist: Playlist
  onClick: (playlist: Playlist) => void
}) => {
  const logoImage =
    playlist.logo?.medium?.url ?? '/public/dummy/default1/default1-logo.png'

  return (
    <Grid
      data-testid="playlist-list-item"
      templateColumns="repeat(8, 1fr)"
      gap={2}
      h="48px"
      px="8px"
      py="4px"
      bg="white"
      borderRadius="md"
      borderLeftWidth="3px"
      borderLeftColor={playlist.primaryLight}
      boxShadow="sm"
      cursor="pointer"
      onClick={() => onClick(playlist)}
    >
      <GridItem colSpan={5} h="40px">
        <Center h="100%" justifyContent="flex-start">
          <HStack textAlign="left">
            <Image
              src={logoImage}
              alt="EditorialHands"
              h="32px"
              boxShadow="xl"
            />
            <Text color="primary" fontWeight="700" noOfLines={1}>
              {playlist.name}
            </Text>
            <ApiStateBadge apiState={playlist.apiState} />
          </HStack>
        </Center>
      </GridItem>
      <GridItem h="40px" colSpan={2}>
        <Center h="100%">
          <HStack>
            <Icon as={MdUpdate} w={6} h={6} />
            <Text>{formatDatetime(playlist.dateModified)}</Text>
          </HStack>
        </Center>
      </GridItem>
      <GridItem h="40px">
        <Center h="100%">
          <HStack>
            <Icon as={MdMonitor} w={6} h={6} />
            <Text>{playlist.itemNum}</Text>
          </HStack>
        </Center>
      </GridItem>
    </Grid>
  )
}
