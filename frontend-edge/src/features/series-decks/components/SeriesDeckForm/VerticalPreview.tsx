import { useParams } from 'react-router-dom'
import { MdSettings } from 'react-icons/all'
import { useWatch } from 'react-hook-form'
import React from 'react'
import { nanoid } from 'nanoid'
import { Box, Heading, HStack, Image, Text } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/icons'

import { playlistLogoUrl } from '@/utils/image'
import { SeriesPlaylist } from '@/types/series_playlist'
import Link from '@/components/Link'

export const VerticalPreview = () => {
  const { seriesDeckId } = useParams()

  const [name, description, playlists] = useWatch({
    name: ['name', 'description', 'playlists']
  })

  return (
    <Box w="300px" bg="white" minH="400px" p={2}>
      <Box border="1px" borderColor="gray.300" p={2}>
        <HStack justifyContent="space-between" alignItems="center">
          <Heading size="sm" mb={2}>
            {name}
          </Heading>

          <Link
            px={0}
            py={0}
            to={`/series-decks/${seriesDeckId}/config`}
            _hover={{ textDecoration: 'none' }}
          >
            <Icon as={MdSettings} w={5} h={5} color="gray" />
          </Link>
        </HStack>
        <Text fontSize="xs" fontWeight="bold">
          説明
        </Text>
        <Text fontSize="xs">{description}</Text>
      </Box>
      <Heading size="xs" my={2}>
        プレイリスト
      </Heading>
      {playlists?.map((playlist: SeriesPlaylist) => (
        <HStack mb={2} key={nanoid()}>
          <Image
            src={playlistLogoUrl(playlist)}
            alt="EditorialHands"
            h="32px"
            boxShadow="md"
            mr={1}
          />
          <Text noOfLines={1}>{playlist.name}</Text>
        </HStack>
      ))}
    </Box>
  )
}
