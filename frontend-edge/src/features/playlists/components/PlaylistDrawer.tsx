import { MdDelete, RiPencilFill } from 'react-icons/all'
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
import Link from '@/components/Link'

import ApiStateBadge from './ApiStateBadge'

const PlaylistList = ({
  playlist,
  isOpen,
  onClose
}: {
  playlist: Playlist
  isOpen: any
  onClose: any
}) => (
  <Drawer isOpen={isOpen} onClose={onClose} size="md">
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
            <Button
              type="submit"
              form="my-form"
              colorScheme="gray"
              variant="outline"
              leftIcon={<MdDelete />}
            >
              削除する
            </Button>
          </ButtonGroup>
        </Center>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
)
export default PlaylistList
