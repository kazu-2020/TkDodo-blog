import { useParams } from 'react-router-dom'
import { useWatch } from 'react-hook-form'
import React from 'react'
import {
  Badge,
  Box,
  Divider,
  Heading,
  HStack,
  Image,
  Text,
  VStack
} from '@chakra-ui/react'

import { dummyImageUrl } from '@/utils/image'
import PlainTextParser from '@/lib/editorjs/plain_text_parser'
import { IDCopyBadge } from '@/features/playlists/components/PlaylistForm/Preview/IDCopyBadge'
import { EpisodeList } from '@/features/playlists/components/PlaylistForm/Preview/EpisodeList'
import { ActorContributor } from '@/features/playlists/components/PlaylistForm/Preview/ActorContributor'
import { usePlaylist } from '@/features/playlists/api/getPlaylist'
import ApiStateBadge from '@/components/ApiStateBadge'

export const VerticalPreview = () => {
  const [
    name,
    description,
    editorData,
    apiState,
    logoImageSrc,
    eyecatchImageSrc,
    heroImageSrc
  ] = useWatch({
    name: [
      'name',
      'description',
      'editorData',
      'apiState',
      'logoImageSrc',
      'eyecatchImageSrc',
      'heroImageSrc'
    ]
  })

  const { playlistUid } = useParams()
  const { data: playlist } = usePlaylist(playlistUid)

  return (
    <Box w="360px" bg="white" minH="400px" p={2}>
      <Box border="1px" borderColor="gray.300" p={2}>
        <Heading size="sm" mb={2}>
          {name}
        </Heading>
        <HStack>
          <Image
            h="54px"
            src={logoImageSrc}
            fallbackSrc={dummyImageUrl(playlist?.dateCreated || '', 'logo')}
            alt="logo"
          />
          <Image
            h="54px"
            src={eyecatchImageSrc}
            fallbackSrc={dummyImageUrl(playlist?.dateCreated || '', 'eyecatch')}
            alt="eyecatch"
          />
          <Image
            h="54px"
            src={heroImageSrc}
            fallbackSrc={dummyImageUrl(playlist?.dateCreated || '', 'hero')}
            alt="hero"
          />
        </HStack>
        <VStack my={2} align="flex-start">
          <IDCopyBadge id={playlist?.stringId} />
          <IDCopyBadge id={playlistUid} />
          <ApiStateBadge apiState={apiState ? 'open' : 'close'} />
          {playlist?.layoutPattern && (
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
        </VStack>
        <Text fontSize="xs" fontWeight="bold" mb={1}>
          説明
        </Text>
        <Text fontSize="xs">{description}</Text>
        <ActorContributor />
      </Box>
      <Heading size="xs" my={4}>
        プレイリスト
      </Heading>
      <EpisodeList />
      <Divider />
      <Heading size="xs" my={4}>
        記事
      </Heading>
      <Box fontSize="xs" p={2}>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {PlainTextParser.parse(editorData)}
        </pre>
      </Box>
    </Box>
  )
}
