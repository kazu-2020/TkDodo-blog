import { RiPencilFill } from 'react-icons/all'
import React from 'react'
import {
  Button,
  ButtonGroup,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  Spacer,
  Text
} from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import { PlaylistDrawerInfo } from '@/features/playlists/components/PlaylistDrawer/PlaylistDrawerInfo'
import { PlaylistDrawerEpisodeList } from '@/features/playlists/components/PlaylistDrawer/PlaylistDrawerEpisodeList'
import { PlaylistDrawerArticle } from '@/features/playlists/components/PlaylistDrawer/PlaylistDrawerArticle'
import { PlaylistDrawerActorContributor } from '@/features/playlists/components/PlaylistDrawer/PlaylistDrawerActorContributor'
import { DeletePlaylist } from '@/features/playlists/components/DeletePlaylist'
import Link from '@/components/Link'

export const PlaylistDrawer = ({
  playlist,
  isOpen,
  onClose
}: {
  playlist: Playlist
  isOpen: any
  onClose: any
}) => (
  <Drawer
    isOpen={isOpen}
    onClose={onClose}
    size="md"
    blockScrollOnMount={false}
  >
    <DrawerContent>
      <DrawerBody p={0}>
        <PlaylistDrawerInfo playlist={playlist} />
        <Spacer mt={5} />
        <Center>
          <ButtonGroup spacing="6">
            <Link
              px={0}
              py={0}
              to={`/playlists/${playlist.playlistUId}`}
              _hover={{ textDecoration: 'none' }}
            >
              <Button
                type="submit"
                form="my-form"
                colorScheme="orange"
                leftIcon={<RiPencilFill />}
              >
                <Text>編集する</Text>
              </Button>
            </Link>
            <DeletePlaylist
              onDrawerClose={onClose}
              playlistId={playlist.playlistUId}
            />
          </ButtonGroup>
        </Center>
        <PlaylistDrawerEpisodeList playlist={playlist} />
        <PlaylistDrawerActorContributor playlist={playlist} />
        <PlaylistDrawerArticle playlist={playlist} />
      </DrawerBody>
    </DrawerContent>
  </Drawer>
)
