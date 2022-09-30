import React from 'react'
import { Box, HStack, Image, Text, Tooltip, VStack } from '@chakra-ui/react'

import { Role } from '@/types/role'
import { EpisodeData } from '@/types/episode_data'

type Props = {
  episode: EpisodeData
}

export const ActorContributor = ({ episode }: Props) => {
  const items = (episode.actors || []).concat(episode.contributors || [])
  if (items.length === 0) {
    return <Box />
  }

  return (
    <VStack align="flex-start" spacing={2} pt={4}>
      <Text
        borderLeft="4px"
        borderLeftColor="orange"
        pl="10px"
        fontWeight="bold"
        fontSize="sm"
        mb={2}
      >
        出演者・関係者
      </Text>
      {items.map((item: Role) => {
        const imageUrl =
          item.person?.image?.small?.url ||
          item.organization?.image?.small?.url ||
          ''
        const name = item.person?.name || item.organization?.name || ''
        return (
          <HStack key={name} flexWrap="wrap">
            <Tooltip label={name}>
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
            </Tooltip>
          </HStack>
        )
      })}
    </VStack>
  )
}
