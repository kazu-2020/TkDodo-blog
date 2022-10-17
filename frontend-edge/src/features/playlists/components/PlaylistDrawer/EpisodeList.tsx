import React from 'react'
import { Alert, AlertIcon, Box, Spacer, Text, VStack } from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import { EpisodeData } from '@/types/episode_data'
import { ListScreenSkeleton } from '@/components/ListScreenSkeleton'

import { EpisodeListItem } from '../EpisodeListItem'
import { usePlaylistItems } from '../../api/getPlaylistItems'

type Props = {
  playlist: Playlist
}

const NoEpisode = () => (
  <Box px={7} py={5}>
    <Spacer mt={5} />
    <Text fontSize="sm" color="rgba(0, 0, 0, 0.6)">
      エピソードは登録されていません
    </Text>
  </Box>
)

export const EpisodeList = ({ playlist }: Props) => {
  const { data, isLoading, isError, isSuccess } = usePlaylistItems(
    playlist.playlistUId
  )

  if (playlist.itemNum <= 0) {
    return NoEpisode()
  }

  if (isLoading) {
    return (
      <Box px={7} py={5}>
        <ListScreenSkeleton size={playlist.itemNum} />
      </Box>
    )
  }

  if (isError) {
    return (
      <Alert status="error">
        <AlertIcon />
        エラーが発生しました
      </Alert>
    )
  }

  if (isSuccess && data?.length) {
    return (
      <Box px={7} py={5} data-testid="playlist-drawer-episode-list">
        <Spacer mt={5} />
        <VStack align="flex-start" spacing={3}>
          {data?.map((item: EpisodeData) => (
            <EpisodeListItem key={item.id} episodeItem={item} />
          ))}
        </VStack>
      </Box>
    )
  }

  return NoEpisode()
}
