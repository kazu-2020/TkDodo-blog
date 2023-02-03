import { Carousel } from 'react-responsive-carousel'
import React, { useState } from 'react'
import { UseInfiniteQueryResult } from '@tanstack/react-query'
import { Box, useDisclosure } from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import { EpisodeData } from '@/types/episode_data'
import { SearchPlaylistPlaylistList } from '@/features/playlists/components/PlaylistForm/ListTab/SearchPlaylistPlaylistList'
import { SearchPlaylistEpisodeList } from '@/features/playlists/components/PlaylistForm/ListTab/SearchPlaylistEpisodeList'
import { PlaylistEpisodeDrawer } from '@/features/playlists/components/PlaylistEpisodeDrawer'
import { Response } from '@/features/playlists/api/getSearchPlaylist'

type Props = {
  query: UseInfiniteQueryResult<Response, Error>
}

export const SearchPlaylist = ({ query }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [page, setPage] = useState(0)
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>()

  const {
    isOpen: isOpenEpisode,
    onOpen: onOpenEpisode,
    onClose: onCloseEpisode
  } = useDisclosure()
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeData>()
  const showEpisodes = (item: Playlist) => {
    onOpen()
    setSelectedPlaylist(item)
    setPage(1)
  }

  if ((query.isLoading || query.isFetching) && page !== 0) {
    setPage(0)
    onClose()
  }

  return (
    <Box>
      <Carousel
        centerMode={false}
        showArrows={false}
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        swipeable={false}
        selectedItem={page}
      >
        <SearchPlaylistPlaylistList
          query={query}
          isOpenEpisodes={isOpen}
          onClick={(item) => showEpisodes(item)}
        />
        <SearchPlaylistEpisodeList
          onClickBack={() => {
            setPage(0)
            onClose()
          }}
          onClick={(episode) => {
            setSelectedEpisode(episode)
            onOpenEpisode()
          }}
          selectedPlaylist={selectedPlaylist}
          isOpen={isOpen}
        />
      </Carousel>
      {selectedEpisode && (
        <PlaylistEpisodeDrawer
          episode={selectedEpisode}
          isOpen={isOpenEpisode}
          onClose={onCloseEpisode}
        />
      )}
    </Box>
  )
}
