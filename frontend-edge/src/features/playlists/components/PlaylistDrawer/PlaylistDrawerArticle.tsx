import React from 'react'
import { Box, Text } from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'

type Props = {
  playlist: Playlist
}

export const PlaylistDrawerArticle = ({ playlist }: Props) => {
  const plainBody = playlist.article?.plainBody?.slice(0, 50) || ''
  if (plainBody) {
    return (
      <Box borderTop="1px" borderColor="gray.200" px={7} py={5}>
        <Text pb={4} fontSize="sm">
          {plainBody}
        </Text>
      </Box>
    )
  }
  return null
}
