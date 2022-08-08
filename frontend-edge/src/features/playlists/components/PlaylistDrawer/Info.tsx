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

import { Playlist } from '@/types/playlist'
import { TextCopyBadge } from '@/components/TextCopyBadge'
import ApiStateBadge from '@/components/ApiStateBadge'
import { dummyImageUrl } from '@/utils/image'

type Props = {
  playlist: Playlist
}

const ellipsizeUid = (playlist: Playlist): string => {
  const uid = playlist.playlistUId || ''
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
    <Box>
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
        <HStack>
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
