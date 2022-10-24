import { useParams } from 'react-router-dom'
import { MdSettings } from 'react-icons/all'
import { useWatch } from 'react-hook-form'
import React from 'react'
import { nanoid } from 'nanoid'
import { Box, Heading, HStack, Image, Text } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/icons'

import { RecommendPlaylist } from '@/types/recommend_playlist'
import Link from '@/components/Link'

export const VerticalPreview = () => {
  const { recommendDeckId } = useParams()

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
            to={`/recommend-decks/${recommendDeckId}/config`}
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
      {playlists?.map((playlist: RecommendPlaylist) => (
        <HStack mb={2} key={nanoid()}>
          <Image
            src={
              playlist.logo?.medium?.url ??
              '/public/dummy/default1/default1-logo.png'
            }
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
