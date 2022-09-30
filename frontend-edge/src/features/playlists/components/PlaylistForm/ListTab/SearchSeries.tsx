import { Carousel } from 'react-responsive-carousel'
import { UseInfiniteQueryResult } from 'react-query'
import React, { useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

import { SeriesData } from '@/types/series_data'
import { Playlist } from '@/types/playlist'
import { EpisodeData } from '@/types/episode_data'
import { SearchSeriesSeriesList } from '@/features/playlists/components/PlaylistForm/ListTab/SearchSeriesSeriesList'
import { SearchSeriesEpisodeList } from '@/features/playlists/components/PlaylistForm/ListTab/SearchSeriesEpisodeList'
import { PlaylistEpisodeDrawer } from '@/features/playlists/components/PlaylistEpisodeDrawer'
import { Response } from '@/features/playlists/api/getSearchSeries'

type Props = {
  query: UseInfiniteQueryResult<Response, Error>
  playlist?: Playlist
}

export const SearchSeries = ({ query, playlist }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [page, setPage] = useState(0)
  const [selectedSeries, setSelectedSeries] = useState<SeriesData>()

  const {
    isOpen: isOpenEpisode,
    onOpen: onOpenEpisode,
    onClose: onCloseEpisode
  } = useDisclosure()
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeData>()

  const showEpisodes = (item: SeriesData) => {
    onOpen()
    setSelectedSeries(item)
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
        <SearchSeriesSeriesList
          query={query}
          isOpenEpisodes={isOpen}
          onClick={(item) => showEpisodes(item)}
        />
        <SearchSeriesEpisodeList
          onClickBack={() => {
            setPage(0)
            onClose()
          }}
          onClick={(episode) => {
            setSelectedEpisode(episode)
            onOpenEpisode()
          }}
          selectedSeries={selectedSeries}
          isOpen={isOpen}
        />
      </Carousel>
      {selectedEpisode && (
        <PlaylistEpisodeDrawer
          playlist={playlist}
          episode={selectedEpisode}
          isOpen={isOpenEpisode}
          onClose={onCloseEpisode}
        />
      )}
    </Box>
  )
}
