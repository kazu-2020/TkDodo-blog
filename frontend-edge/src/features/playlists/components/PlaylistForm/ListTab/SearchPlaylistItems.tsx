import React from 'react'
import { Box } from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import { SearchPlaylistItem } from '@/features/playlists/components/PlaylistForm/ListTab/SearchPlaylistItem'

type Props = {
  onClick: (item: Playlist) => void
  items?: Playlist[]
}

export const SearchPlaylistItems = ({ onClick, items }: Props) => (
  <Box>
    {items?.map((item: Playlist) => (
      <SearchPlaylistItem
        key={item.id}
        item={item}
        onClick={() => onClick(item)}
      />
    ))}
  </Box>
)
