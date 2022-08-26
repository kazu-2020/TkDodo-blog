import React from 'react'
import { Alert, AlertIcon, Box } from '@chakra-ui/react'

import { useRecommendDeckFormStore } from '@/features/recommend-decks/stores/recommendDeckForm'
import { RecommendPlaylistListHeader } from '@/features/recommend-decks/components/RecommendDeckForm/RecommendPlaylistListHeader'
import { EditRecommendPlaylistListItem } from '@/features/recommend-decks/components/RecommendDeckForm/EditRecommendPlaylistListItem'

export const EditRecommendPlaylist = () => {
  const { recommendPlaylists } = useRecommendDeckFormStore((state) => ({
    recommendPlaylists: state.recommendPlaylists
  }))

  // @ts-ignore
  return (
    <Box mb={10} data-testid="edit-recommend-playlist">
      <RecommendPlaylistListHeader />
      {recommendPlaylists.length < 1 && (
        <Alert status="warning" colorScheme="gray">
          <AlertIcon />
          編成可能なプレイリストからプレイリストを追加してください
        </Alert>
      )}
      {recommendPlaylists.map((playlist) => (
        <EditRecommendPlaylistListItem
          key={playlist.playlistUId}
          playlist={playlist}
        />
      ))}
    </Box>
  )
}
