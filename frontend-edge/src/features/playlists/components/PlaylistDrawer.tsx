import { RiPencilFill } from 'react-icons/all'
import {
  Box,
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
import DeletePlaylist from '@/features/playlists/components/DeletePlaylist'
import Link from '@/components/Link'
import ApiStateBadge from '@/components/ApiStateBadge'

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
      <DrawerBody px={3}>
        <Box borderWidth={1} borderRadius="sm" p={3}>
          <Text fontWeight={700}>{playlist.name}</Text>
          <ApiStateBadge apiState={playlist.apiState} />
        </Box>
        <Spacer mt={5} />
        <Center>
          <ButtonGroup spacing="6">
            <Button
              type="submit"
              form="my-form"
              colorScheme="orange"
              leftIcon={<RiPencilFill />}
            >
              <Link
                px={0}
                py={0}
                to={`/playlists/${playlist.playlistUId}`}
                _hover={{ textDecoration: 'none' }}
              >
                <Text>編集する</Text>
              </Link>
            </Button>
            <DeletePlaylist
              onDrawerClose={onClose}
              playlistId={playlist.playlistUId}
            />
          </ButtonGroup>
        </Center>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
)
