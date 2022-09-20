import { Carousel } from 'react-responsive-carousel'
import { UseInfiniteQueryResult } from 'react-query'
import React, { useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import { SearchPlaylistPlaylistList } from '@/features/playlists/components/PlaylistForm/ListTab/SearchPlaylistPlaylistList'
import { SearchPlaylistEpisodeList } from '@/features/playlists/components/PlaylistForm/ListTab/SearchPlaylistEpisodeList'
import { Response } from '@/features/playlists/api/getSearchPlaylist'

type Props = {
  query: UseInfiniteQueryResult<Response, Error>
}

export const SearchPlaylist = ({ query }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [page, setPage] = useState(0)
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>()
  const showEpisodes = (item: Playlist) => {
    onOpen()
    setSelectedPlaylist(item)
    setPage(1)
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
          selectedPlaylist={selectedPlaylist}
          isOpen={isOpen}
        />
      </Carousel>
    </Box>
  )
}
