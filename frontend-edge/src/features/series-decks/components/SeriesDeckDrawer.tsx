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
import Link from '@/components/Link'
import ApiStateBadge from '@/components/ApiStateBadge'

import DeleteSeriesDeck from './DeleteSeriesDeck'

const SeriesDeckList = ({
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
      <DrawerBody px={3}>
        <Box borderWidth={1} borderRadius="sm" p={3}>
          <Text fontWeight={700}>{seriesDeck.name}</Text>
          <ApiStateBadge apiState={seriesDeck.apiState} />
        </Box>
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
      </DrawerBody>
    </DrawerContent>
  </Drawer>
)
export default SeriesDeckList
