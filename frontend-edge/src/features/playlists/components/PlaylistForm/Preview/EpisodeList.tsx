import { useWatch } from 'react-hook-form'
import React from 'react'
import { Box, Text } from '@chakra-ui/react'

import { EpisodeData } from '@/types/episode_data'
import { EpisodeListItem } from '@/features/playlists/components'

export const EpisodeList = () => {
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
