import React from 'react'
import { Box } from '@chakra-ui/react'

import { SeriesData } from '@/types/series_data'
import { SearchSeriesItem } from '@/features/playlists/components/PlaylistForm/ListTab/SearchSeriesItem'

type Props = {
  onClick: (item: SeriesData) => void
  items?: SeriesData[]
}

export const SearchSeriesItems = ({ onClick, items }: Props) => (
  <Box w="100%">
    {items?.map((item: SeriesData) => (
      <SearchSeriesItem
        key={item.id}
        item={item}
        onClick={() => onClick(item)}
      />
    ))}
  </Box>
)
