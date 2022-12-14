import { MdMonitor, MdUpdate } from 'react-icons/md'
import { Box, Flex, HStack, Icon, Image, Text, VStack } from '@chakra-ui/react'

import { playlistLogoUrl } from '@/utils/image'
import { formatDatetime } from '@/utils/format'
import { Playlist } from '@/types/playlist'
import ApiStateBadge from '@/components/ApiStateBadge'

const articleOutline = (playlist: Playlist): string => {
  const text = playlist.articleBody?.replace(/\n\n/g, '<br/>')
  return text && text.length > 0 ? text : '記事はまだありません'
}

export const PlaylistListArticleItem = ({
  playlist,
  onClick
}: {
  playlist: Playlist
  onClick: (playlist: Playlist) => void
}) => (
  <Flex
    h="176px"
    px="12px"
    py="4px"
    bg="white"
    borderRadius="md"
    borderLeftWidth="3px"
    borderLeftColor={playlist.primaryLightColor}
    boxShadow="sm"
    justifyContent="space-between"
    cursor="pointer"
    onClick={() => onClick(playlist)}
  >
    <HStack>
      <Image
        src={playlistLogoUrl(playlist)}
        alt="EditorialHands"
        h="160px"
        boxShadow="xl"
        mr="24px"
      />
      <VStack align="flex-start" direction="column" h="100%" spacing={0}>
        <HStack>
          <Text color="primary" fontWeight="700" fontSize="xl" noOfLines={1}>
            {playlist.name}
          </Text>
          <ApiStateBadge apiState={playlist.apiState} />
        </HStack>
        <Flex grow={2} m={0}>
          <Box m={0} maxHeight="90px" overflow="hidden" textAlign="justify">
            <Text fontSize="md" mt="5px" mb="16px" noOfLines={3}>
              {articleOutline(playlist)}
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
  </Flex>
)

if (import.meta.vitest) {
  const { playlistGenerator } = await import('@/test/data-generators')

  const { describe, it, expect } = import.meta.vitest
  describe('articleOutline', () => {
    it('記事が定義されている場合', () => {
      const playlist = playlistGenerator({ articleBody: 'dummy' })
      expect(articleOutline(playlist)).toEqual('dummy')
    })

    it('記事が定義されていない場合', () => {
      const playlist = playlistGenerator({ articleBody: undefined })
      expect(articleOutline(playlist)).toEqual('記事はまだありません')
    })

    it('記事中の改行がBRタグに変換されていること', () => {
      const playlist = playlistGenerator({
        articleBody: 'dummy\n\ndummy\ndummy'
      })
      expect(articleOutline(playlist)).toEqual('dummy<br/>dummy\ndummy')
    })
  })
}
