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
  useToast,
  VStack
} from '@chakra-ui/react'

import { dummyImageUrl } from '@/utils/image'
import { EpisodeData } from '@/types/episode_data'
import PlainTextParser from '@/lib/editorjs/plain_text_parser'
import { EpisodeListItem } from '@/features/playlists/components/EpisodeListItem'
import { usePlaylist } from '@/features/playlists/api/getPlaylist'
import { TextCopyBadge } from '@/components/TextCopyBadge'
import ApiStateBadge from '@/components/ApiStateBadge'

const CopyBadge = ({ text }: { text: string | undefined }) => {
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

  if (text === undefined) {
    return null
  }

  return <TextCopyBadge m={0} prefix="Id" text={text} onCopy={onCopy} />
}

const EpisodeList = () => {
  const [episodes] = useWatch({
    name: ['episodes']
  })

  if (episodes.length < 1) {
    return (
      <Box>
        <Text fontSize="sm" my={4} key="episodes-undefined">
          エピソードは登録されていません
        </Text>
      </Box>
    )
  }

  return (
    <Box>
      {episodes?.slice(0, 9).map((item: EpisodeData) => (
        <EpisodeListItem key={item.id} episodeItem={item} mb={2} />
      ))}
    </Box>
  )
}

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

  const { playlistUId } = useParams()
  const { data: playlist } = usePlaylist(playlistUId)

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
          <CopyBadge text={playlist?.stringId} />
          <CopyBadge text={playlistUId} />
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
