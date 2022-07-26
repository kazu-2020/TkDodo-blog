import { useState } from 'react'
import { Box, Stack, useDisclosure } from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import { PlaylistListItem } from '@/features/playlists/components/PlaylistListItem'
import { PlaylistDrawer } from '@/features/playlists/components/PlaylistDrawer'
import { Pagination } from '@/components/Pagination'

type Props = {
  items?: Playlist[]
  page?: number
  totalCount?: number
  onChangePage: (page: number) => void
}

export const PlaylistListItems = ({
  items = [],
  page = 1,
  totalCount = 0,
  onChangePage = () => {}
}: Props) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<
    Playlist | undefined
  >(undefined)
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Stack>
      {totalCount > 0 && (
        <Box pt={10} pb={3}>
          <Pagination
            page={page}
            totalCount={totalCount}
            onChangePage={onChangePage}
          />
        </Box>
      )}

      {items?.map((playlist: Playlist) => (
        <PlaylistListItem
          key={playlist.playlistUId}
          playlist={playlist}
          setSelectedPlaylist={setSelectedPlaylist}
          onOpen={onOpen}
        />
      ))}

      {totalCount > 0 && (
        <Box pt={3} pb={10}>
          <Pagination
            page={page}
            totalCount={totalCount}
            onChangePage={onChangePage}
          />
        </Box>
      )}

      {selectedPlaylist && (
        <PlaylistDrawer
          playlist={selectedPlaylist}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </Stack>
  )
}
