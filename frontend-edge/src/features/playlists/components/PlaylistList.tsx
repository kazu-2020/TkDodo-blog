import { useState } from 'react'
import { Skeleton, Stack, useDisclosure } from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import PlaylistListItem from '@/features/playlists/components/PlaylistListItem'
import PlaylistDrawer from '@/features/playlists/components/PlaylistDrawer'

import { usePlaylists } from '../api/getPlaylists'

const PlaylistList = () => {
  const { data, isLoading } = usePlaylists()
  const [selectedPlaylist, setSelectedPlaylist] = useState<
    Playlist | undefined
  >(undefined)
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (isLoading) {
    return (
      <Stack>
        {[...Array(20)].map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Skeleton key={i} h="48px" px={3} bg="white" borderRadius="md" />
        ))}
      </Stack>
    )
  }

  return (
    <Stack>
      {data?.map((playlist: Playlist) =>
        PlaylistListItem({ playlist, setSelectedPlaylist, onOpen })
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
export default PlaylistList
