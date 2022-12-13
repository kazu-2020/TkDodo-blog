import { useWatch } from 'react-hook-form'
import React from 'react'
import { nanoid } from 'nanoid'
import { Box, HStack, Image, Text, Tooltip, VStack } from '@chakra-ui/react'

import {
  personOrganizationImageUrl,
  personOrganizationName
} from '@/utils/personOrganization'
import { Role } from '@/types/role'
import { EpisodeData } from '@/types/episode_data'

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
