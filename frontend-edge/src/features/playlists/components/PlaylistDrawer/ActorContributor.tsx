import React from 'react'
import { Box, HStack, Image, Spacer, Text, VStack } from '@chakra-ui/react'

import {
  personOrganizationImageUrl,
  personOrganizationName,
  personOrganizationOccupationName,
  personOrganizationRoleName
} from '@/utils/personOrganization'
import { Role } from '@/types/role'
import { Playlist } from '@/types/playlist'
import { usePlaylistActorsAndContributors } from '@/features/playlists/api/getPlaylistActorsAndContributors'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'

type Props = {
  playlist: Playlist
}

const NoActorContributor = () => (
  <Box borderTop="1px" borderColor="gray.200" px={7} py={5}>
    <Text>出演者/スタッフ</Text>
    <Spacer mt={5} />
    <Box>
      <Text fontSize="sm" color="rgba(0, 0, 0, 0.6)">
        出演者/スタッフは登録されていません
      </Text>
    </Box>
  </Box>
)

export const ActorContributor = ({ playlist }: Props) => {
  const { data, isLoading } = usePlaylistActorsAndContributors(
    playlist.playlistUid
  )

  if (playlist.itemNum <= 0) {
    return null
  }

  if (isLoading) {
    return (
      <Box borderTop="1px" borderColor="gray.200" px={7} py={5}>
        <Text>出演者/スタッフ</Text>
        <Spacer mt={5} />
        <Box>
          <ListScreenSkeleton size={3} />
        </Box>
      </Box>
    )
  }

  const items = (data?.actor || []).concat(data?.contributor || [])
  if (items.length <= 0) {
    return NoActorContributor()
  }

  return (
    <Box
      borderTop="1px"
      borderColor="gray.200"
      px={7}
      py={5}
      data-testid="playlist-drawer__actor-contributor"
    >
      <Text>出演者/スタッフ</Text>
      <Spacer mt={5} />
      <VStack align="flex-start" spacing={4}>
        {items.map((item: Role) => {
          const imageUrl = personOrganizationImageUrl(item)
          const name = personOrganizationName(item)
          return (
            <HStack key={name}>
              <Box w="60px" h="60px" borderRadius="30px" bgColor="#546e7a">
                {imageUrl !== '' && (
                  <Image borderRadius="30px" src={imageUrl} />
                )}
                {imageUrl === '' && (
                  <Text
                    fontSize="xl"
                    textAlign="center"
                    color="white"
                    lineHeight="60px"
                  >
                    {name.slice(0, 1)}
                  </Text>
                )}
              </Box>
              <VStack align="flex-start" spacing={0.5}>
                <Text fontSize="sm" color="rgba(0, 0, 0, 0.6)">
                  {personOrganizationRoleName(item)}
                </Text>
                <Text fontSize="sm">{name}</Text>
                <Text fontSize="sm">
                  {personOrganizationOccupationName(item)}
                </Text>
              </VStack>
            </HStack>
          )
        })}
      </VStack>
    </Box>
  )
}
