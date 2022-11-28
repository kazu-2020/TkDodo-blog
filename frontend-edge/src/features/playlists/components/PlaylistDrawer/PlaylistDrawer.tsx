import { RiPencilFill } from 'react-icons/all'
import React from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerContent,
  HStack,
  Spacer,
  Text
} from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import { Info } from '@/features/playlists/components/PlaylistDrawer/Info'
import { EpisodeList } from '@/features/playlists/components/PlaylistDrawer/EpisodeList'
import { Article } from '@/features/playlists/components/PlaylistDrawer/Article'
import { ActorContributor } from '@/features/playlists/components/PlaylistDrawer/ActorContributor'
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
        <Info playlist={playlist} />
        <Spacer mt={5} />
        <Box m={4}>
          <ButtonGroup w="100%" spacing="6">
            <HStack w="100%" justify="space-between">
              <Link
                px={0}
                py={0}
                to={`/playlists/${playlist.playlistUid}`}
                _hover={{ textDecoration: 'none' }}
              >
                <Button
                  data-testid="playlist-drawer-edit-button"
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
                playlistId={playlist.playlistUid}
              />
            </HStack>
          </ButtonGroup>
        </Box>
        <EpisodeList playlist={playlist} />
        <ActorContributor playlist={playlist} />
        <Article playlist={playlist} />
      </DrawerBody>
    </DrawerContent>
  </Drawer>
)
