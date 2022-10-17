import React from 'react'
import { Box, HStack, Image, Spacer, Text, VStack } from '@chakra-ui/react'

import { Role } from '@/types/role'
import { Playlist } from '@/types/playlist'
import { usePlaylistActorsAndContributors } from '@/features/playlists/api/getPlaylistActorsAndContributors'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'

type Props = {
  playlist: Playlist
}

const roleName = (role: Role) => {
  const roleTypes: { [key: string]: string } = {
    author: '著者',
    copyrightHolder: '著作権者',
    creator: '作家',
    producer: '制作統括者',
    publisher: '出版者',
    funder: '提供者',
    sponsor: 'スポンサー',
    translator: '翻訳者',
    character: 'キャラクター',
    editor: '編集者',
    director: '監督',
    musicBy: 'サウンドトラックの作曲者',
    actor: '出演'
  }

  const roleType = role.person?.roleName || role.organization?.roleName || ''
  return roleTypes[roleType] || roleType
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
    playlist.playlistUId
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
          const imageUrl =
            item.person?.image?.small?.url ||
            item.organization?.image?.small?.url ||
            ''
          const name = item.person?.name || item.organization?.name || ''
          const occupation = item.person?.occupationName || ''
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
                  {roleName(item)}
                </Text>
                <Text fontSize="sm">{name}</Text>
                <Text fontSize="sm">{occupation}</Text>
              </VStack>
            </HStack>
          )
        })}
      </VStack>
    </Box>
  )
}
