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
