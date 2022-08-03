import { useParams } from 'react-router-dom'
import { MdSettings } from 'react-icons/all'
import React from 'react'
import { nanoid } from 'nanoid'
import { Box, Heading, HStack, Image, Text } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/icons'

import { useSeriesDeckFormStore } from '@/features/series-decks/stores/seriesDeckForm'
import Link from '@/components/Link'

export const VerticalPreview = () => {
  const { seriesDeckId } = useParams()

  const inputValues = useSeriesDeckFormStore((state) => state.inputValues)
  const seriesPlaylists = useSeriesDeckFormStore(
    (state) => state.seriesPlaylists
  )

  return (
    <Box w="300px" bg="white" minH="400px" p={2}>
      <Box border="1px" borderColor="gray.300" p={2}>
        <HStack justifyContent="space-between" alignItems="center">
          <Heading size="sm" mb={2}>
            {inputValues.name}
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
        <Text fontSize="xs">{inputValues.description}</Text>
      </Box>
      <Heading size="xs" my={2}>
        プレイリスト
      </Heading>
      {seriesPlaylists.map((playlist) => (
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
          <Text>{playlist.name}</Text>
        </HStack>
      ))}
    </Box>
  )
}
