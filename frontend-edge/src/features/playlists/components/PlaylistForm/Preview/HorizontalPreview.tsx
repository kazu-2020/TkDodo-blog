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
import { HorizontalEpisodeList } from '@/features/playlists/components/PlaylistForm/Preview/HorizontalEpisodeList'
import { ActorContributor } from '@/features/playlists/components/PlaylistForm/Preview/ActorContributor'
import { usePlaylist } from '@/features/playlists/api/getPlaylist'
import ApiStateBadge from '@/components/ApiStateBadge'

export const HorizontalPreview = () => {
  const [name, description, editorData, apiState, logoImageSrc, episodes] =
    useWatch({
      name: [
        'name',
        'description',
        'editorData',
        'apiState',
        'logoImageSrc',
        'episodes'
      ]
    })

  const { playlistUid } = useParams()
  const { data: playlist } = usePlaylist(playlistUid)

  const articleText = PlainTextParser.parse(editorData)

  return (
    <Box w="100%" bg="white" p={6}>
      <VStack w="100%">
        <HStack w="100%" alignItems="flex-start">
          <Box maxW="150px">
            <Image
              borderRadius="4px"
              src={logoImageSrc}
              fallbackSrc={dummyImageUrl(playlist?.dateCreated || '', 'logo')}
              alt="logo"
            />
            <Text fontSize="xs" color="gray" py={2}>
              エピソード数 全 {episodes?.length || 0} 件
            </Text>
          </Box>
          <VStack w="150px" alignItems="flex-start">
            <ApiStateBadge apiState={apiState ? 'open' : 'close'} />
            <IDCopyBadge id={playlist?.stringId} />
            <IDCopyBadge id={playlistUid} />
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
            <ActorContributor />
          </VStack>
          <VStack maxW="900px" flexGrow={3} alignItems="flex-start">
            <Heading size="sm" mb={2} mx={12} noOfLines={1}>
              {name}
            </Heading>
            <HorizontalEpisodeList episodes={episodes} />
          </VStack>
        </HStack>
        <Divider />
        <HStack w="100%" alignItems="flex-start">
          <VStack w="50%" alignItems="flex-start">
            <Heading size="xs" my={4}>
              説明
            </Heading>
            {description?.length > 0 && (
              <Text fontSize="xs">{description}</Text>
            )}
            {description?.length <= 0 && (
              <Text fontSize="xs" color="gray">
                説明は登録されていません
              </Text>
            )}
          </VStack>
          <VStack w="50%" alignItems="flex-start">
            <Heading size="xs" my={4}>
              記事
            </Heading>
            {articleText?.length > 0 && (
              <Box fontSize="xs">
                <pre style={{ whiteSpace: 'pre-wrap' }}>{articleText}</pre>
              </Box>
            )}
            {articleText?.length <= 0 && (
              <Text fontSize="xs" color="gray">
                記事は登録されていません
              </Text>
            )}
          </VStack>
        </HStack>
        <Divider />
      </VStack>
    </Box>
  )
}
