import React from 'react'
import { Box, Spacer, Text, VStack } from '@chakra-ui/react'

import { SeriesPlaylist } from '@/types/series_playlist'
import { SeriesDeck } from '@/types/series_deck'
import { PlaylistListItem } from '@/features/series-decks/components/SeriesDeckDrawer/PlaylistListItem'

type Props = {
  seriesDeck: SeriesDeck
}

const NoPlaylist = () => (
  <Box px={7} py={2}>
    <Text fontSize="sm" color="rgba(0, 0, 0, 0.6)">
      プレイリストは登録されていません
    </Text>
  </Box>
)

export const PlaylistList = ({ seriesDeck }: Props) => {
  const maxPreviewCount = 10

  if (seriesDeck.playListCount <= 0) {
    return NoPlaylist()
  }

  const otherPlaylistCount = seriesDeck.playListCount - maxPreviewCount
  return (
    <Box px={7} py={5}>
      <Spacer mt={5} />
      <Text>プレイリスト</Text>
      <Spacer mt={5} />
      {seriesDeck.playlists.length <= 0 && NoPlaylist()}
      {seriesDeck.playlists.length > 0 && (
        <VStack align="flex-start" spacing={3}>
          {seriesDeck.playlists
            ?.slice(0, maxPreviewCount)
            ?.map((item: SeriesPlaylist) => (
              <PlaylistListItem
                key={item.id}
                seriesDeck={seriesDeck}
                playlistItem={item}
              />
            ))}
        </VStack>
      )}
      <Spacer mt={5} />
      {otherPlaylistCount > 0 && <Text>他 {otherPlaylistCount} 件</Text>}
    </Box>
  )
}
