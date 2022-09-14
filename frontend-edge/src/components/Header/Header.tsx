import { MdOutlinePlaylistPlay, MdViewList } from 'react-icons/md'
import {
  Box,
  Flex,
  Icon,
  IconButton,
  Image,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Center
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'

import Link from '../Link'

const LinkWithMenuItem = ({ to, text }: { to: string; text: string }) => (
  <Link px={0} py={0} to={to} _hover={{ textDecoration: 'none' }}>
    <MenuItem>{text}</MenuItem>
  </Link>
)

export const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box
      bg="White"
      px={4}
      boxShadow="md"
      pos="sticky"
      zIndex="999"
      w="full"
      top={0}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <Flex alignItems="center">
          <Center h="60px">
            <Link px={0} py={0} to="/" _hover={{ textDecoration: 'none' }}>
              <Image src="/logo-black@2x.jpg" alt="EditorialHands" h="32px" />
            </Link>
          </Center>
          <Flex as="nav" ml={6} display={{ base: 'none', md: 'flex' }}>
            <Box>
              <Menu>
                <MenuButton
                  as={Button}
                  cursor="pointer"
                  minW={0}
                  color="#000000DE"
                  bg="white"
                  fontWeight="normal"
                >
                  <Center>
                    <Icon as={MdOutlinePlaylistPlay} w={6} h={6} mr={1} />
                    <Text>プレイリスト</Text>
                  </Center>
                </MenuButton>
                <MenuList>
                  <LinkWithMenuItem to="playlists" text="一覧" />
                  <LinkWithMenuItem to="playlists/new" text="新規作成" />
                </MenuList>
              </Menu>
            </Box>
            <Box ml={4}>
              <Menu>
                <MenuButton
                  as={Button}
                  cursor="pointer"
                  minW={0}
                  color="#000000DE"
                  bg="white"
                  fontWeight="normal"
                >
                  <Center>
                    <Icon as={MdViewList} w={6} h={6} mr={1} />
                    <Text>デッキ</Text>
                  </Center>
                </MenuButton>
                <MenuList>
                  <LinkWithMenuItem
                    to="recommend-decks"
                    text="レコメンドデッキ一覧"
                  />
                  <LinkWithMenuItem
                    to="recommend-decks/new"
                    text="レコメンドデッキ新規作成"
                  />
                  <MenuItem>レコメンドデッキビューア</MenuItem>
                  <MenuDivider />
                  <LinkWithMenuItem
                    to="series-decks"
                    text="シリーズデッキ一覧"
                  />
                  <LinkWithMenuItem
                    to="series-decks/new"
                    text="シリーズデッキ新規作成"
                  />
                </MenuList>
              </Menu>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}
