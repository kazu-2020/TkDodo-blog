import { MdOutlinePlaylistPlay, MdViewList } from 'react-icons/md'
import {
  Box,
  Flex,
  HStack,
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

import Link from './Link'

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box bg="White" px={4} boxShadow="md" pos="fixed" zIndex="999" w="full">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems="center">
          <Center h="60px">
            <Link px={0} py={0} to="/" _hover={{ textDecoration: 'none' }}>
              <Image src="/logo-black@2x.jpg" alt="EditorialHands" h="32px" />
            </Link>
          </Center>
          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
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
                <Link
                  px={0}
                  py={0}
                  to="playlists"
                  _hover={{ textDecoration: 'none' }}
                >
                  <MenuItem>一覧</MenuItem>
                </Link>
                <Link
                  px={0}
                  py={0}
                  to="playlists/new"
                  _hover={{ textDecoration: 'none' }}
                >
                  <MenuItem>新規作成</MenuItem>
                </Link>
              </MenuList>
            </Menu>
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
                <Link
                  px={0}
                  py={0}
                  to="recommend-decks"
                  _hover={{ textDecoration: 'none' }}
                >
                  <MenuItem>レコメンドデッキ一覧</MenuItem>
                </Link>
                <Link
                  px={0}
                  py={0}
                  to="recommend-decks/new"
                  _hover={{ textDecoration: 'none' }}
                >
                  <MenuItem>レコメンドデッキ新規作成</MenuItem>
                </Link>
                <MenuItem>レコメンドデッキビューア</MenuItem>
                <MenuDivider />
                <Link
                  px={0}
                  py={0}
                  to="series-decks"
                  _hover={{ textDecoration: 'none' }}
                >
                  <MenuItem>シリーズデッキ一覧</MenuItem>
                </Link>
                <Link
                  px={0}
                  py={0}
                  to="series-decks/new"
                  _hover={{ textDecoration: 'none' }}
                >
                  <MenuItem>シリーズデッキ新規作成</MenuItem>
                </Link>
              </MenuList>
            </Menu>
          </HStack>
        </HStack>
      </Flex>
    </Box>
  )
}
export default Header
