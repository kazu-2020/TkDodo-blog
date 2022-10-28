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
  Text,
  VStack
} from '@chakra-ui/react'

import { RecommendDeck } from '@/types/recommend_deck'
import { PlaylistList } from '@/features/recommend-decks/components/RecommendDeckDrawer/PlaylistList'
import { Info } from '@/features/recommend-decks/components/RecommendDeckDrawer/Info'
import DeleteRecommendDeck from '@/features/recommend-decks/components/DeleteRecommendDeck'
import Link from '@/components/Link'

export const RecommendDeckDrawer = ({
  recommendDeck,
  isOpen,
  onClose
}: {
  recommendDeck: RecommendDeck
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
        <VStack data-testid="recommend-deck-drawer">
          <Info recommendDeck={recommendDeck} />
          <Spacer mt={5} />
          <Center>
            <ButtonGroup spacing="6">
              <Link
                px={0}
                py={0}
                to={`/recommend-decks/${recommendDeck.deckUid}/config`}
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
                to={`/recommend-decks/${recommendDeck.deckUid}`}
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
              <DeleteRecommendDeck
                onDrawerClose={onClose}
                recommendDeckId={recommendDeck.deckUid}
              />
            </ButtonGroup>
          </Center>
          <Box w="100%">
            <PlaylistList recommendDeck={recommendDeck} />
          </Box>
        </VStack>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
)
