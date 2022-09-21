import { RiPencilFill, MdSettings } from 'react-icons/all'
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

import { SeriesDeck } from '@/types/series_deck'
import { PlaylistList } from '@/features/series-decks/components/SeriesDeckDrawer/PlaylistList'
import { Info } from '@/features/series-decks/components/SeriesDeckDrawer/Info'
import DeleteSeriesDeck from '@/features/series-decks/components/DeleteSeriesDeck'
import Link from '@/components/Link'

export const SeriesDeckDrawer = ({
  seriesDeck,
  isOpen,
  onClose
}: {
  seriesDeck: SeriesDeck
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
        <Info seriesDeck={seriesDeck} />
        <Spacer mt={5} />
        <Center>
          <ButtonGroup spacing="6">
            <Link
              px={0}
              py={0}
              to={`/series-decks/${seriesDeck.id}/config`}
              _hover={{ textDecoration: 'none' }}
            >
              <Button
                type="submit"
                form="my-form"
                colorScheme="gray"
                leftIcon={<MdSettings />}
              >
                <Text>管理設定</Text>
              </Button>
            </Link>
            <Link
              px={0}
              py={0}
              to={`/series-decks/${seriesDeck.id}`}
              _hover={{ textDecoration: 'none' }}
            >
              <Button
                type="submit"
                form="my-form"
                colorScheme="orange"
                leftIcon={<RiPencilFill />}
              >
                <Text>デッキ編集</Text>
              </Button>
            </Link>
            <DeleteSeriesDeck
              onDrawerClose={onClose}
              seriesDeckId={seriesDeck.id}
            />
          </ButtonGroup>
        </Center>
        <Box w="100%">
          <PlaylistList seriesDeck={seriesDeck} />
        </Box>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
)
