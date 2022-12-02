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

const personOrganizationName = (role: Role) =>
  role.person?.name || role.organization?.name || ''

const personOrganizationImageUrl = (role: Role) =>
  role.person?.image?.small?.url || role.organization?.image?.small?.url || ''

const occupationName = (role: Role) => role.person?.occupationName || ''

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
                  {roleName(item)}
                </Text>
                <Text fontSize="sm">{name}</Text>
                <Text fontSize="sm">{occupationName(item)}</Text>
              </VStack>
            </HStack>
          )
        })}
      </VStack>
    </Box>
  )
}

if (import.meta.vitest) {
  const { rolePersonGenerator, roleOrganizationGenerator } = await import(
    '@/test/data-generators'
  )

  const { describe, it, expect } = import.meta.vitest
  describe('roleName', () => {
    it('個人のロール名が存在するとき', () => {
      const person = rolePersonGenerator({ roleName: 'author' })
      expect(roleName({ person })).toEqual('著者')
    })

    it('組織のロール名が存在するとき', () => {
      const organization = roleOrganizationGenerator({
        roleName: 'copyrightHolder'
      })
      expect(roleName({ organization })).toEqual('著作権者')
    })

    it('個人・組織のロール名が存在するとき', () => {
      const person = rolePersonGenerator({ roleName: 'author' })
      const organization = roleOrganizationGenerator({
        roleName: 'copyrightHolder'
      })
      expect(roleName({ person, organization })).toEqual('著者')
    })

    it('存在しないロール名のとき', () => {
      const person = rolePersonGenerator({ roleName: 'undefined_role_name' })
      expect(roleName({ person })).toEqual('undefined_role_name')
    })

    it('ロール名が空のとき', () => {
      const person = rolePersonGenerator({ roleName: '' })
      expect(roleName({ person })).toEqual('')
    })
  })

  describe('personOrganizationName', () => {
    it('個人の名前が存在するとき', () => {
      const person = rolePersonGenerator({ name: 'test person name' })
      expect(personOrganizationName({ person })).toEqual('test person name')
    })

    it('組織の名前が存在するとき', () => {
      const organization = roleOrganizationGenerator({
        name: 'test organization name'
      })
      expect(personOrganizationName({ organization })).toEqual(
        'test organization name'
      )
    })

    it('個人・組織の名前が存在するとき', () => {
      const person = rolePersonGenerator({ name: 'test person name' })
      const organization = roleOrganizationGenerator({
        name: 'test organization name'
      })
      expect(personOrganizationName({ person, organization })).toEqual(
        'test person name'
      )
    })

    it('名前が空のとき', () => {
      const person = rolePersonGenerator({ name: '' })
      expect(personOrganizationName({ person })).toEqual('')
    })

    it('名前が未定義のとき', () => {
      const person = rolePersonGenerator({ name: undefined })
      expect(personOrganizationName({ person })).toEqual('')
    })

    it('ロールが未定義のとき', () => {
      expect(personOrganizationName({ person: undefined })).toEqual('')
    })
  })

  describe('personOrganizationImageUrl', () => {
    const imageRole1 = {
      main: { url: 'main1.jpg', width: 1, height: 1 },
      medium: { url: 'medium1.jpg', width: 1, height: 1 },
      small: { url: 'small1.jpg', width: 1, height: 1 }
    }

    const imageRole2 = {
      main: { url: 'main2.jpg', width: 1, height: 1 },
      medium: { url: 'medium2.jpg', width: 1, height: 1 },
      small: { url: 'small2.jpg', width: 1, height: 1 }
    }

    it('個人の画像が存在するとき', () => {
      const person = rolePersonGenerator({ image: imageRole1 })
      expect(personOrganizationImageUrl({ person })).toEqual('small1.jpg')
    })

    it('組織の画像が存在するとき', () => {
      const organization = roleOrganizationGenerator({ image: imageRole2 })
      expect(personOrganizationImageUrl({ organization })).toEqual('small2.jpg')
    })

    it('個人・組織の画像が存在するとき', () => {
      const person = rolePersonGenerator({ image: imageRole1 })
      const organization = roleOrganizationGenerator({
        image: imageRole2
      })
      expect(personOrganizationImageUrl({ person, organization })).toEqual(
        'small1.jpg'
      )
    })

    it('画像が未定義のとき', () => {
      const person = rolePersonGenerator({ image: undefined })
      expect(personOrganizationImageUrl({ person })).toEqual('')
    })

    it('ロールが未定義のとき', () => {
      expect(personOrganizationImageUrl({ person: undefined })).toEqual('')
    })
  })

  describe('occupationName', () => {
    it('未定義のとき', () => {
      const person = rolePersonGenerator({ occupationName: undefined })
      expect(occupationName({ person })).toEqual('')
    })

    it('定義されているとき', () => {
      const person = rolePersonGenerator({ occupationName: 'dummy occupation' })
      expect(occupationName({ person })).toEqual('dummy occupation')
    })
  })
}
