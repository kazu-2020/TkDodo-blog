import { MdMonitor, MdUpdate } from 'react-icons/md'
import { Box, Flex, HStack, Icon, Image, Text, VStack } from '@chakra-ui/react'

import { formatDatetime } from '@/utils/format'
import { Playlist } from '@/types/playlist'
import ApiStateBadge from '@/components/ApiStateBadge'

export const PlaylistListItem = ({
  playlist,
  setSelectedPlaylist,
  onOpen,
  isArticle
}: {
  playlist: Playlist
  setSelectedPlaylist: any
  onOpen: any
  isArticle: boolean
}) => {
  const logoImage =
    playlist.logo?.medium?.url ?? '/public/dummy/default1/default1-logo.png'

  const handleClick = () => {
    setSelectedPlaylist(playlist)
    onOpen()
  }

  const playListName =
    playlist.name.length > 24 ? `${playlist.name.slice(0, 24)}…` : playlist.name

  const articleOutline = (): string => {
    const text = playlist.article.plainBody?.replace(/\n\n/g, '<br/>')
    return text && text.length > 0 ? text : '記事はまだありません'
  }

  return (
    <Flex
      key={playlist.playlistUId}
      h={isArticle ? '176px' : '48px'}
      px={isArticle ? '12px' : '8px'}
      py={isArticle ? '4px' : '8px'}
      bg="white"
      borderRadius="md"
      borderLeftWidth="3px"
      borderLeftColor={playlist.primaryLight}
      boxShadow="sm"
      justifyContent="space-between"
      cursor="pointer"
      onClick={() => handleClick()}
    >
      {isArticle && (
        <HStack>
          <Image
            src={logoImage}
            alt="EditorialHands"
            h="160px"
            boxShadow="xl"
            mr="24px"
          />
          <VStack align="flex-start" direction="column" h="100%" spacing={0}>
            <HStack>
              <Text color="primary" fontWeight="700" fontSize="xl">
                {playListName}
              </Text>
              <ApiStateBadge apiState={playlist.apiState} />
            </HStack>
            <Flex grow={2} m={0}>
              <Box m={0} maxHeight="90px" overflow="hidden" textAlign="justify">
                <Text fontSize="md" mt="5px" mb="16px">
                  {articleOutline()}
                </Text>
              </Box>
            </Flex>
            <HStack pt="8px" pb="4px">
              <Icon as={MdUpdate} w={6} h={6} />
              <Text>{formatDatetime(playlist.dateModified)}</Text>
              <Icon as={MdMonitor} w={6} h={6} />
              <Text>{playlist.itemNum}</Text>
            </HStack>
          </VStack>
        </HStack>
      )}
      {!isArticle && (
        <HStack>
          <HStack>
            <Image
              src={logoImage}
              alt="EditorialHands"
              h="32px"
              boxShadow="xl"
            />
            <Text color="primary" fontWeight="700">
              {playListName}
            </Text>
            <ApiStateBadge apiState={playlist.apiState} />
          </HStack>
          <HStack>
            <Icon as={MdUpdate} w={6} h={6} />
            <Text>{formatDatetime(playlist.dateModified)}</Text>
            <Icon as={MdMonitor} w={6} h={6} />
            <Text>{playlist.itemNum}</Text>
          </HStack>
        </HStack>
      )}
    </Flex>
  )
}
