import { useWatch } from 'react-hook-form'
import React from 'react'
import { nanoid } from 'nanoid'
import { Box, HStack, Image, Text, Tooltip, VStack } from '@chakra-ui/react'

import { Role } from '@/types/role'
import { EpisodeData } from '@/types/episode_data'

const personOrganizationName = (role: Role) =>
  role.person?.name || role.organization?.name || ''

const personOrganizationImageUrl = (role: Role) =>
  role.person?.image?.small?.url || role.organization?.image?.small?.url || ''

export const ActorContributor = () => {
  const [episodes] = useWatch({
    name: ['episodes']
  })

  if (episodes.length === 0) {
    return null
  }

  const actorContributors = episodes.reduce(
    (roles: Array<Role>, episode: EpisodeData) =>
      roles.concat((episode.actors || []).concat(episode.contributors || [])),
    []
  )

  if (actorContributors.length === 0) {
    return <Box />
  }

  return (
    <VStack align="flex-start" w="100%" spacing={2} pt={2}>
      <Text fontSize="xs">出演者・関係者</Text>
      <HStack w="100%" flexWrap="wrap" spacing={0}>
        {actorContributors.map((role: Role) => {
          const imageUrl = personOrganizationImageUrl(role)
          const name = personOrganizationName(role)
          return (
            <Tooltip key={nanoid()} w="30px" label={name}>
              <Box p={1}>
                <Box w="30px" h="30px" borderRadius="15px" bgColor="#546e7a">
                  {imageUrl !== '' && (
                    <Image borderRadius="15px" src={imageUrl} />
                  )}
                  {imageUrl === '' && (
                    <Text
                      fontSize="xs"
                      textAlign="center"
                      color="white"
                      lineHeight="30px"
                    >
                      {name.slice(0, 1)}
                    </Text>
                  )}
                </Box>
              </Box>
            </Tooltip>
          )
        })}
      </HStack>
    </VStack>
  )
}

if (import.meta.vitest) {
  const { rolePersonGenerator, roleOrganizationGenerator } = await import(
    '@/test/data-generators'
  )

  const { describe, it, expect } = import.meta.vitest
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
}
