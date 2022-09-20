import { Carousel } from 'react-responsive-carousel'
import { UseInfiniteQueryResult } from 'react-query'
import React, { useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

import { SeriesData } from '@/types/series_data'
import { SearchSeriesSeriesList } from '@/features/playlists/components/PlaylistForm/ListTab/SearchSeriesSeriesList'
import { SearchSeriesEpisodeList } from '@/features/playlists/components/PlaylistForm/ListTab/SearchSeriesEpisodeList'
import { Response } from '@/features/playlists/api/getSearchSeries'

type Props = {
  query: UseInfiniteQueryResult<Response, Error>
}

export const SearchSeries = ({ query }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [page, setPage] = useState(0)
  const [selectedSeries, setSelectedSeries] = useState<SeriesData>()

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
          onClick={(item) => showEpisodes(item)}
        />
        <SearchSeriesEpisodeList
          onClickBack={() => {
            setPage(0)
            onClose()
          }}
          selectedSeries={selectedSeries}
          isOpen={isOpen}
        />
      </Carousel>
    </Box>
  )
}
