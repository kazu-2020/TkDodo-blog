import React from 'react'
import {
  Badge,
  Box,
  HStack,
  Image,
  Text,
  useToast,
  VStack
} from '@chakra-ui/react'

import { dummyImageUrl } from '@/utils/image'
import { Playlist } from '@/types/playlist'
import { TextCopyBadge } from '@/components/TextCopyBadge'
import ApiStateBadge from '@/components/ApiStateBadge'

type Props = {
  playlist: Playlist
}

const ellipsizeUid = (playlist: Playlist): string => {
  const uid = playlist.playlistUid || ''
  return uid.length > 8 ? `${uid.slice(0, 8)}...` : uid
}

export const Info = ({ playlist }: Props) => {
  const toast = useToast()
  const onCopy = () => {
    toast({
      title: 'コピー',
      description: 'IDをコピーしました',
      status: 'info',
      duration: 3000,
      position: 'bottom-right',
      isClosable: true
    })
  }

  return (
    <Box data-testid="playlist-drawer-info">
      <VStack
        align="flex-start"
        spacing={4}
        borderWidth={1}
        borderRadius="sm"
        m={4}
        p={3}
      >
        <Text fontWeight={700}>{playlist.name}</Text>
        <Box>
          <ApiStateBadge apiState={playlist.apiState} />
          <TextCopyBadge
            prefix="Uid"
            text={ellipsizeUid(playlist)}
            onCopy={onCopy}
          />
          <TextCopyBadge
            prefix="Uid"
            text={playlist.stringId}
            onCopy={onCopy}
          />
          {playlist.layoutPattern && (
            <Badge
              ml="1"
              px={3}
              py={0.5}
              fontSize="xs"
              variant="solid"
              colorScheme="purple"
              borderRadius="xl"
            >
              {playlist.layoutPattern}
            </Badge>
          )}
        </Box>
        <HStack data-testid="playlist-drawer-info__images">
          <Image
            w="73px"
            src={playlist.logo?.medium?.url}
            fallbackSrc={dummyImageUrl(playlist.dateCreated, 'logo')}
            alt="logo"
          />
          <Image
            w="130px"
            src={playlist.eyecatch?.medium?.url}
            fallbackSrc={dummyImageUrl(playlist.dateCreated, 'eyecatch')}
            alt="eyecatch"
          />
          <Image
            w="220px"
            src={playlist.hero?.medium?.url}
            fallbackSrc={dummyImageUrl(playlist.dateCreated, 'hero')}
            alt="hero"
          />
        </HStack>
        {playlist.detailedCatch && (
          <Box>
            <Text fontWeight={700} fontSize="sm">
              キャッチコピー
            </Text>
            <Text fontSize="sm">{playlist.detailedCatch}</Text>
          </Box>
        )}
        {playlist.description && (
          <Box>
            <Text fontWeight={700} fontSize="sm">
              説明
            </Text>
            <Text fontSize="sm">{playlist.description}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  )
}

if (import.meta.vitest) {
  const { playlistGenerator } = await import('@/test/data-generators')
  const { describe, it, expect } = import.meta.vitest
  describe('ellipsizeUid', () => {
    it('未定義の場合', () => {
      const playlist = playlistGenerator({ playlistUid: undefined })
      expect(ellipsizeUid(playlist)).toEqual('')
    })
    it('空の場合', () => {
      const playlist = playlistGenerator({ playlistUid: '' })
      expect(ellipsizeUid(playlist)).toEqual('')
    })
    it('8文字の場合', () => {
      const playlistUid = 'A'.repeat(8)
      const playlist = playlistGenerator({ playlistUid })
      expect(ellipsizeUid(playlist)).toEqual(playlistUid)
    })
    it('9文字の場合', () => {
      const playlistUid = 'A'.repeat(8)
      const playlist = playlistGenerator({ playlistUid: `${playlistUid}B` })
      expect(ellipsizeUid(playlist)).toEqual(`${playlistUid}...`)
    })
  })
}
