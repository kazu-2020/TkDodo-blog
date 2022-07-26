import { MdMonitor, MdUpdate } from 'react-icons/md'
import { Flex, HStack, Icon, Image, Text } from '@chakra-ui/react'

import { formatDatetime } from '@/utils/format'
import { Playlist } from '@/types/playlist'
import ApiStateBadge from '@/components/ApiStateBadge'

export const PlaylistListItem = ({
  playlist,
  setSelectedPlaylist,
  onOpen
}: {
  playlist: Playlist
  setSelectedPlaylist: any
  onOpen: any
}) => {
  const logoImage =
    playlist.logo?.medium?.url ?? '/public/dummy/default1/default1-logo.png'

  const handleClick = () => {
    setSelectedPlaylist(playlist)
    onOpen()
  }

  return (
    <Flex
      key={playlist.playlistUId}
      h="48px"
      px={3}
      bg="white"
      borderRadius="md"
      borderLeftWidth="3px"
      borderLeftColor={playlist.style.primaryLight}
      boxShadow="sm"
      justifyContent="space-between"
      cursor="pointer"
      onClick={() => handleClick()}
    >
      <HStack>
        <Image src={logoImage} alt="EditorialHands" h="32px" boxShadow="xl" />
        <Text color="primary" fontWeight="700">
          {playlist.name}
        </Text>
        <ApiStateBadge apiState={playlist.apiState} />
      </HStack>
      <HStack>
        <Icon as={MdUpdate} w={6} h={6} />
        <Text>{formatDatetime(playlist.dateModified)}</Text>
        <Icon as={MdMonitor} w={6} h={6} />
        <Text>{playlist.itemNum}</Text>
      </HStack>
    </Flex>
  )
}
