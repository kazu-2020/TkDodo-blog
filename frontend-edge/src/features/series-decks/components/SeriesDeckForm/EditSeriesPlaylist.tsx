import React from 'react'
import { Alert, AlertIcon, Box, Grid, GridItem, Text } from '@chakra-ui/react'

import { useSeriesDeckFormStore } from '@/features/series-decks/stores/seriesDeckForm'
import { EditSeriesPlaylistListItem } from '@/features/series-decks/components/SeriesDeckForm/EditSeriesPlaylistListItem'

export const EditSeriesPlaylist = () => {
  const seriesPlaylists = useSeriesDeckFormStore(
    (state) => state.seriesPlaylists
  )

  return (
    <Box mb={10}>
      <Grid
        templateColumns="repeat(12, 1fr)"
        gap={6}
        borderBottom="1px"
        borderColor="gray.200"
        fontSize="xs"
        fontWeight="bold"
        color="gray"
        p={2}
      >
        <GridItem h="5" />
        <GridItem colSpan={6} h="5">
          <Text>シリーズ</Text>
        </GridItem>
        <GridItem colSpan={5} h="5">
          <Text>アイテム数</Text>
        </GridItem>
      </Grid>

      {seriesPlaylists.length < 1 && (
        <Alert status="warning" colorScheme="gray">
          <AlertIcon />
          プレイリストを追加してください
        </Alert>
      )}
      {seriesPlaylists.map((playlist) => (
        <EditSeriesPlaylistListItem
          key={playlist.seriesId}
          playlist={playlist}
        />
      ))}
    </Box>
  )
}
