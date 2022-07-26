import { Heading } from '@chakra-ui/react'

import { PlaylistList } from '../components/PlaylistList'

const Playlists = () => (
  <>
    <Heading as="h2" size="md" mb={5}>
      プレイリスト一覧
    </Heading>
    <PlaylistList />
  </>
)
export default Playlists
