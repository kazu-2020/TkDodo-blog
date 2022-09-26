import { useState } from 'react'
import { Box, Stack, useDisclosure } from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import { PlaylistListItem } from '@/features/playlists/components/PlaylistListItem'
import { PlaylistListArticleItem } from '@/features/playlists/components/PlaylistListArticleItem'
import { PlaylistDrawer } from '@/features/playlists/components/PlaylistDrawer'
import { Pagination } from '@/components/Pagination'

type Props = {
  items?: Playlist[]
  page?: number
  totalCount?: number
  isArticle?: boolean
  onChangePage: (page: number) => void
}

export const PlaylistListItems = ({
  items = [],
  page = 1,
  totalCount = 0,
  isArticle = false,
  onChangePage = () => {}
}: Props) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<
    Playlist | undefined
  >(undefined)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
    onOpen()
  }

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

      {!isArticle &&
        items?.map((playlist: Playlist) => (
          <PlaylistListItem
            key={playlist.playlistUId}
            playlist={playlist}
            onClick={(value) => handleClick(value)}
          />
        ))}
      {isArticle &&
        items?.map((playlist: Playlist) => (
          <PlaylistListArticleItem
            key={playlist.playlistUId}
            playlist={playlist}
            onClick={(value) => handleClick(value)}
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
