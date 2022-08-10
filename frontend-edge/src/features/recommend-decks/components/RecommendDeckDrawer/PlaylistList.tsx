import React from 'react'
import { Box, Spacer, Text, VStack } from '@chakra-ui/react'

import { RecommendDeck } from '@/types/recommend_deck'
import { Playlist } from '@/types/playlist'
import { PlaylistListItem } from '@/features/recommend-decks/components/RecommendDeckDrawer/PlaylistListItem'

type Props = {
  recommendDeck: RecommendDeck
}

const NoPlaylist = () => (
  <Box px={7} py={2}>
    <Text fontSize="sm" color="rgba(0, 0, 0, 0.6)">
      プレイリストは登録されていません
    </Text>
  </Box>
)

export const PlaylistList = ({ recommendDeck }: Props) => {
  const maxPreviewCount = 10

  if (recommendDeck.playListCount <= 0) {
    return NoPlaylist()
  }

  const otherPlaylistCount = recommendDeck.playListCount - maxPreviewCount
  return (
    <Box px={7} py={5}>
      <Spacer mt={5} />
      <Text>プレイリスト</Text>
      <Spacer mt={5} />
      {recommendDeck.playlists.length <= 0 && NoPlaylist()}
      {recommendDeck.playlists.length > 0 && (
        <VStack align="flex-start" spacing={3}>
          {recommendDeck.playlists
            ?.slice(0, maxPreviewCount)
            ?.map((item: Playlist) => (
              <PlaylistListItem
                key={item.playlistUId}
                recommendDeck={recommendDeck}
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
