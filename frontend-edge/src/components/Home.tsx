import React from 'react'
import { Button, Heading, HStack } from '@chakra-ui/react'

import Link from './Link'

const Home = () => (
  <>
    <Heading size="md" mb={4}>
      プレイリスト
    </Heading>
    <HStack spacing={4}>
      <Button colorScheme="teal" variant="solid">
        <Link to="playlists" color="">
          プレイリスト一覧
        </Link>
      </Button>
      <Button colorScheme="teal" variant="solid">
        <Link to="playlists/new" color="">
          プレイリスト新規作成
        </Link>
      </Button>
    </HStack>
    <Heading size="md" my={4}>
      レコメンドデッキ
    </Heading>
    <HStack spacing={4}>
      <Button colorScheme="teal" variant="solid">
        <Link to="recommend-decks" color="">
          レコメンドデッキ一覧
        </Link>
      </Button>
      <Button colorScheme="teal" variant="solid">
        <Link to="recommend-decks/new" color="">
          レコメンドデッキ新規作成
        </Link>
      </Button>
    </HStack>
    <Heading size="md" my={4}>
      シリーズデッキ
    </Heading>
    <HStack spacing={4}>
      <Button colorScheme="teal" variant="solid">
        <Link to="series-decks" color="">
          シリーズデッキ一覧
        </Link>
      </Button>
      <Button colorScheme="teal" variant="solid">
        <Link to="series-decks/new" color="">
          シリーズデッキ新規作成
        </Link>
      </Button>
    </HStack>
  </>
)
export default Home
